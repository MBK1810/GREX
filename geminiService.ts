import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis, Question, ProficiencyLevel } from "./types";

const VERIFICATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    candidateName: { type: Type.STRING },
    overallAuthenticityScore: { type: Type.NUMBER },
    verifiedSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidence: { type: Type.NUMBER }
        },
        required: ['skill', 'evidence', 'confidence']
      }
    },
    exaggeratedSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          reason: { type: Type.STRING },
          missingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['skill', 'reason', 'missingEvidence']
      }
    },
    fakeSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          reason: { type: Type.STRING },
          contradictionSource: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['skill', 'reason', 'contradictionSource']
      }
    },
    certificateMismatch: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claimedCertificate: { type: Type.STRING },
          status: { type: Type.STRING }
        },
        required: ['claimedCertificate', 'status']
      }
    },
    experienceMismatch: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          resumeRole: { type: Type.STRING },
          linkedinRole: { type: Type.STRING },
          issue: { type: Type.STRING }
        },
        required: ['resumeRole', 'linkedinRole', 'issue']
      }
    },
    finalConclusion: { type: Type.STRING }
  },
  required: [
    'candidateName',
    'overallAuthenticityScore', 
    'verifiedSkills', 
    'exaggeratedSkills', 
    'fakeSkills', 
    'certificateMismatch', 
    'experienceMismatch', 
    'finalConclusion'
  ]
};

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const performFullVerification = async (
  resumeFile: { data: string, mimeType: string } | string,
  linkedInUrl: string
): Promise<any> => {
  const ai = getAIClient();
  
  const textPrompt = `
    You are the GREX Forensic Skill Verification Engine. 
    Compare the provided Resume against this LinkedIn context: ${linkedInUrl}.
    
    DETECT:
    1. Direct contradictions in employment dates or titles.
    2. Skills claimed in the resume that have zero presence or endorsement on LinkedIn.
    3. Exaggerated seniority levels.
    
    OUTPUT: Strict JSON matching the provided schema.
  `;

  const parts: any[] = [{ text: textPrompt }];

  if (typeof resumeFile === 'string') {
    parts.push({ text: `Resume Text: ${resumeFile}` });
  } else {
    parts.push({ inlineData: resumeFile });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: VERIFICATION_SCHEMA,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    return JSON.parse(text.trim());
  } catch (error: any) {
    console.error("Gemini Engine Error:", error);
    if (error.message?.includes('Requested entity was not found')) {
      throw new Error("KEY_PROJECT_MISMATCH: The selected project does not have the Gemini API enabled or billing is not active.");
    }
    throw error;
  }
};

export const generateVerificationQuestions = async (skill: string, level: ProficiencyLevel): Promise<Question[]> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate 5 technical interview questions to verify proficiency in ${skill} at a ${level} level. 
      Return an array of objects with 'id' (string) and 'question' (string).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING }
            },
            required: ['id', 'question']
          }
        },
      }
    });
    return JSON.parse(response.text?.trim() || '[]');
  } catch (e) {
    console.error("Question Generation Error:", e);
    return [];
  }
};

export const evaluateVerificationAnswers = async (
  skill: string, 
  questions: Question[], 
  answers: Record<string, string>
): Promise<{score: number, feedback: string, isPassed: boolean}> => {
  const ai = getAIClient();
  const qaPairs = questions.map(q => `Q: ${q.question}\nA: ${answers[q.id] || 'No answer'}`).join('\n\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Evaluate technical answers for: ${skill}. Score 0-100, feedback, isPassed. Threshold 70%.\nQA Data:\n${qaPairs}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            isPassed: { type: Type.BOOLEAN }
          },
          required: ['score', 'feedback', 'isPassed']
        },
      }
    });
    return JSON.parse(response.text?.trim() || '{"score":0,"feedback":"Evaluation error","isPassed":false}');
  } catch (e) {
    return { score: 0, feedback: "Evaluation engine failed to reach consensus.", isPassed: false };
  }
};

export const generateRecoveryEmail = async (email: string, resetLink: string): Promise<{subject: string, body: string}> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional account recovery email for ${email}. Reset link: ${resetLink}. Return JSON {subject, body}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } },
          required: ['subject', 'body']
        }
      }
    });
    return JSON.parse(response.text?.trim() || '{"subject":"Recovery","body":"Check link"}');
  } catch (e) {
    return { subject: "Account Recovery", body: `Reset link: ${resetLink}` };
  }
};
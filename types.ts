export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface User {
  username: string;
  password?: string;
  email?: string;
}

export interface Question {
  id: string;
  question: string;
}

export interface TestSession {
  skill: string;
  level: ProficiencyLevel;
  questions: Question[];
  answers: Record<string, string>;
  isCompleted: boolean;
  result?: {
    score: number;
    feedback: string;
    isPassed: boolean;
  };
}

export interface VerifiedSkill {
  skill: string;
  evidence: ("resume" | "linkedin")[];
  confidence: number;
}

export interface ExaggeratedSkill {
  skill: string;
  reason: string;
  missingEvidence: ("linkedin")[];
}

export interface FakeSkill {
  skill: string;
  reason: string;
  contradictionSource: ("linkedin" | "experience")[];
}

export interface CertMismatch {
  claimedCertificate: string;
  status: "mismatch" | "not_found_on_linkedin";
}

export interface ExperienceMismatch {
  resumeRole: string;
  linkedinRole: string;
  issue: string;
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  candidateName: string;
  overallAuthenticityScore: number;
  verifiedSkills: VerifiedSkill[];
  exaggeratedSkills: ExaggeratedSkill[];
  fakeSkills: FakeSkill[];
  certificateMismatch: CertMismatch[];
  experienceMismatch: ExperienceMismatch[];
  finalConclusion: string;
  timestamp: number;
  rawInputs: {
    resumeText: string;
    linkedInUrl: string;
  };
}
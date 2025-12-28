
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateVerificationQuestions, evaluateVerificationAnswers } from '../geminiService';
import { ResumeAnalysis, TestSession, ProficiencyLevel } from '../types';

interface Props {
  analysis: ResumeAnalysis | null;
  session: TestSession | null;
  setSession: React.Dispatch<React.SetStateAction<TestSession | null>>;
}

const SkillVerification: React.FC<Props> = ({ analysis, session, setSession }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const skillToTest = queryParams.get('skill');
  const levelToTest = (queryParams.get('level') as ProficiencyLevel) || 'Intermediate';

  useEffect(() => {
    if (!analysis) {
      navigate('/');
      return;
    }

    if (skillToTest && !session) {
      initSession();
    }
  }, [analysis, skillToTest]);

  const initSession = async () => {
    if (!skillToTest) return;
    setIsInitializing(true);
    try {
      const questions = await generateVerificationQuestions(skillToTest, levelToTest);
      setSession({
        skill: skillToTest,
        level: levelToTest,
        questions,
        answers: {},
        isCompleted: false
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleNext = () => {
    if (!session) return;
    if (currentQuestionIdx < session.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!session || !analysis) return;
    setIsSubmitting(true);
    try {
      const result = await evaluateVerificationAnswers(session.skill, session.questions, answers);
      
      const storedResumes = localStorage.getItem('grex_resumes');
      if (storedResumes) {
        const updatedResumes = JSON.parse(storedResumes);
        const targetIdx = updatedResumes.findIndex((r: ResumeAnalysis) => r.id === analysis.id);
        
        if (targetIdx !== -1) {
          const resume = updatedResumes[targetIdx];
          // In the new simplified model, we don't store skills in the same way, 
          // but we can update the credibility or add to results if needed.
          // For now, let's just finish the session.
          localStorage.setItem('grex_resumes', JSON.stringify(updatedResumes));
        }
      }

      setSession({ ...session, answers, isCompleted: true, result });
      navigate(`/report/${analysis.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 text-indigo-600 mb-6" style={{ border: '4px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Generating Adaptive Questions</h2>
        <p className="text-slate-500">Tailoring difficulty for {skillToTest} ({levelToTest})...</p>
      </div>
    );
  }

  if (!session) return null;

  const currentQ = session.questions[currentQuestionIdx];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Technical Verification</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Testing {session.skill} - {session.level}</p>
        </div>
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Node {currentQuestionIdx + 1} / {session.questions.length}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-10">
        <div className="mb-8">
          <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]" 
              style={{ width: `${((currentQuestionIdx + 1) / session.questions.length) * 100}%` }}
            ></div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
            {currentQ.question}
          </h3>
          
          <textarea
            autoFocus
            key={currentQ.id}
            value={answers[currentQ.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
            placeholder="Provide technical depth..."
            className="w-full h-48 p-6 border border-slate-200 rounded-2xl focus:border-indigo-600 outline-none transition-all bg-slate-50 text-slate-900 text-lg shadow-inner"
          />
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
            disabled={currentQuestionIdx === 0}
            className="text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-900 disabled:opacity-0 transition-all px-4 py-2"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[currentQ.id]?.trim() || isSubmitting}
            className={`px-8 py-3 rounded-xl font-bold text-sm tracking-widest uppercase shadow-md transition-all active:scale-95 ${
              !answers[currentQ.id]?.trim() || isSubmitting
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isSubmitting ? 'Evaluating...' : (currentQuestionIdx === session.questions.length - 1 ? 'Finish Scan' : 'Next Node')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillVerification;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeAnalysis } from '../types';

interface Props {
  resumes: ResumeAnalysis[];
}

const Dashboard: React.FC<Props> = ({ resumes }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 animate-in fade-in duration-700">
      <div className="max-w-4xl w-full text-center space-y-10 md:space-y-16">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 flex-shrink-0">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">GREX</h1>
          </div>
          <p className="text-slate-500 text-base md:text-lg font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed px-2">
            An AI-powered system that detects fake and exaggerated skills in resumes by verifying them against real evidence.
          </p>
          <div className="flex flex-col items-center gap-2 pt-2">
            <p className="text-indigo-600 font-black italic text-lg md:text-xl flex items-center gap-3">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01701V14H12.017C14.2261 14 16.017 15.7909 16.017 18V21H14.017ZM10.017 21H8.01701V18C8.01701 17.4477 7.5693 17 7.01701 17H4.01701V15H7.01701C8.67386 15 10.017 16.3431 10.017 18V21ZM14.017 11H12.017V8C12.017 7.44772 11.5693 7 11.017 7H8.01701V5H11.017C12.6739 5 14.017 6.34315 14.017 8V11Z" />
              </svg>
              “Honest skills build honest careers.”
            </p>
          </div>
        </div>
        
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => navigate('/upload')}
            className="w-full md:w-auto px-8 md:px-16 py-5 md:py-6 bg-indigo-600 text-white rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-base md:text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
          >
            START NEW VERIFICATION
          </button>
        </div>

        <div className="pt-8 md:pt-12 flex flex-col items-center gap-3 opacity-60">
          <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">@2025 GREX</p>
          <p className="text-[10px] md:text-xs font-black text-slate-800 tracking-[0.2em] uppercase">POWERED BY TECH GREX</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

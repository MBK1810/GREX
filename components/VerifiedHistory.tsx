
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeAnalysis, User } from '../types';

interface Props {
  resumes: ResumeAnalysis[];
}

const VerifiedHistory: React.FC<Props> = ({ resumes }) => {
  const navigate = useNavigate();
  const currentUser: User = JSON.parse(localStorage.getItem('grex_session') || '{}');
  const userResumes = resumes.filter(r => r.userId === currentUser.username);

  return (
    <div className="space-y-8 md:space-y-10 px-4 animate-in fade-in duration-500">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">History</h1>
        </div>

        {userResumes.length === 0 ? (
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
             <svg className="w-16 h-16 md:w-20 md:h-20 text-slate-200 mb-4 md:mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs md:text-sm">NO HISTORY FOUND</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
            {userResumes.map(resume => (
              <div 
                key={resume.id}
                onClick={() => navigate(`/report/${resume.id}`)}
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer group flex flex-col min-h-[250px] md:min-h-[300px]"
              >
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <span className="text-slate-400 font-black group-hover:text-white uppercase text-sm md:text-base">{resume.candidateName.charAt(0)}</span>
                  </div>
                  <div className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${
                    resume.overallAuthenticityScore > 80 ? 'border-green-100 text-green-700 bg-green-50' : 
                    resume.overallAuthenticityScore > 50 ? 'border-amber-100 text-amber-700 bg-amber-50' : 
                    'border-red-100 text-red-700 bg-red-50'
                  }`}>
                    {resume.overallAuthenticityScore}% Trust
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 md:mb-6 uppercase tracking-tighter truncate">{resume.candidateName}</h3>
                
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                    {resume.verifiedSkills.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-50 text-slate-600 rounded">
                        {s.skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] md:text-xs text-slate-500 line-clamp-2 italic leading-relaxed">{resume.finalConclusion}</p>
                </div>

                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-50 flex items-center justify-between text-indigo-600 font-black text-[10px] md:text-xs uppercase tracking-widest opacity-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>ANALYTICS REPORT</span>
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedHistory;

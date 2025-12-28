import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResumeAnalysis } from '../types';

interface Props { resumes: ResumeAnalysis[]; }

const ReportView: React.FC<Props> = ({ resumes }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = resumes.find(r => r.id === id);

  if (!report) return (
    <div className="text-center py-20 flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">Report Not Found</h2>
      <button onClick={() => navigate('/history')} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all">Back to History</button>
    </div>
  );

  const formattedDate = new Date(report.timestamp).toLocaleDateString();
  const formattedTime = new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-24 px-4 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-10">
        <div className="space-y-2 md:space-y-4 text-center md:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none break-words">{report.candidateName}</h1>
          <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {formattedDate} <span className="text-slate-300 mx-1 md:mx-2">|</span> {formattedTime}
            </div>
          </div>
        </div>
        
        <div className="text-center md:text-right space-y-1 md:space-y-2">
          <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Authenticity</p>
          <div className={`text-7xl md:text-9xl font-black tracking-tighter leading-none ${
            report.overallAuthenticityScore > 80 ? 'text-green-600' : 
            report.overallAuthenticityScore > 50 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {report.overallAuthenticityScore}<span className="text-3xl md:text-5xl">%</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Verified */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 md:space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-green-50 rounded-full -mr-12 -mt-12 opacity-50" />
          <div className="flex items-center gap-4 relative">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-green-600 flex items-center justify-center text-white">
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Verified</h3>
              <p className="text-[9px] md:text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Confirmed Evidence</p>
            </div>
          </div>
          <div className="space-y-4 relative">
            {report.verifiedSkills.length > 0 ? report.verifiedSkills.map((s, i) => (
              <div key={i} className="p-4 md:p-5 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <p className="font-black text-slate-900 uppercase text-base md:text-lg tracking-tight">{s.skill}</p>
                  <span className="text-[8px] md:text-[9px] font-black text-green-600 uppercase tracking-widest px-2 py-1 bg-green-50 rounded-lg">{s.confidence}% Match</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.evidence.map((ev, idx) => (
                    <span key={idx} className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-lg"># {ev}</span>
                  ))}
                </div>
              </div>
            )) : <p className="text-slate-400 text-[10px] italic py-8 text-center uppercase font-black tracking-widest">No Verified Skills</p>}
          </div>
        </div>

        {/* Exaggerated */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 md:space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-amber-50 rounded-full -mr-12 -mt-12 opacity-50" />
          <div className="flex items-center gap-4 relative">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-500 flex items-center justify-center text-white">
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Exaggerated</h3>
              <p className="text-[9px] md:text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">Weak/Missing Proof</p>
            </div>
          </div>
          <div className="space-y-4 relative">
            {report.exaggeratedSkills.length > 0 ? report.exaggeratedSkills.map((s, i) => (
              <div key={i} className="p-4 md:p-5 bg-amber-50/30 rounded-2xl md:rounded-[2rem] border border-amber-50">
                <p className="font-black text-slate-900 uppercase text-base md:text-lg tracking-tight mb-1 md:mb-2">{s.skill}</p>
                <p className="text-[10px] md:text-[11px] text-amber-700 font-bold leading-relaxed mb-3 md:mb-4">“{s.reason}”</p>
                <div className="flex flex-wrap gap-2">
                  {s.missingEvidence.map((ev, idx) => (
                    <span key={idx} className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest bg-white border border-amber-100 text-amber-600 px-2 py-1 rounded-lg">Missing: {ev}</span>
                  ))}
                </div>
              </div>
            )) : <p className="text-slate-400 text-[10px] italic py-8 text-center uppercase font-black tracking-widest">No Exaggerated Skills</p>}
          </div>
        </div>

        {/* Fake */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 md:space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-red-50 rounded-full -mr-12 -mt-12 opacity-50" />
          <div className="flex items-center gap-4 relative">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-600 flex items-center justify-center text-white">
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Fraud Alert</h3>
              <p className="text-[9px] md:text-[10px] text-red-600 font-bold uppercase tracking-widest mt-1">Contradictions Found</p>
            </div>
          </div>
          <div className="space-y-4 relative">
            {report.fakeSkills.length > 0 ? report.fakeSkills.map((s, i) => (
              <div key={i} className="p-4 md:p-5 bg-red-50/30 rounded-2xl md:rounded-[2rem] border border-red-50">
                <p className="font-black text-slate-900 uppercase text-base md:text-lg tracking-tight mb-1 md:mb-2">{s.skill}</p>
                <p className="text-[10px] md:text-[11px] text-red-700 font-bold leading-relaxed mb-3 md:mb-4 italic">“{s.reason}”</p>
                <div className="flex flex-wrap gap-2">
                  {s.contradictionSource.map((ev, idx) => (
                    <span key={idx} className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest bg-red-600 text-white px-2 py-1 rounded-lg">Source: {ev}</span>
                  ))}
                </div>
              </div>
            )) : <p className="text-slate-400 text-[10px] italic py-8 text-center uppercase font-black tracking-widest">No Fake Skills Identified</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10">
        <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white space-y-6 md:space-y-8">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Certificate Mismatches</h3>
          <div className="space-y-3 md:space-y-4">
            {report.certificateMismatch.length > 0 ? report.certificateMismatch.map((c, i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 gap-3">
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-300">{c.claimedCertificate}</span>
                <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] px-3 md:px-4 py-1.5 rounded-lg ${
                  c.status === 'mismatch' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>
            )) : (
              <div className="p-8 md:p-10 text-center space-y-4">
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px]">All Claimed Certifications Verified</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 space-y-6 md:space-y-8">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Experience Forensics</h3>
          <div className="space-y-4 md:space-y-6">
            {report.experienceMismatch.length > 0 ? report.experienceMismatch.map((m, i) => (
              <div key={i} className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border-l-4 md:border-l-8 border-amber-400 space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Resume Role: <span className="text-slate-900">{m.resumeRole}</span></span>
                  <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">LinkedIn Role: <span className="text-indigo-600">{m.linkedinRole}</span></span>
                </div>
                <div className="p-3 md:p-4 bg-white rounded-xl border border-slate-100 italic font-bold text-[11px] md:text-xs text-slate-700 leading-relaxed shadow-sm">
                  “{m.issue}”
                </div>
              </div>
            )) : (
              <div className="p-8 md:p-10 text-center space-y-4">
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px]">Job History Consistent Across Profiles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-[2rem] md:rounded-[4rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 top-0 w-40 md:w-64 h-40 md:h-64 bg-white/10 rounded-full blur-3xl -mr-20 md:-mr-32 -mt-20 md:-mt-32"></div>
        <div className="relative space-y-4 md:space-y-6 max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">CONCLUSION</h3>
          <p className="text-lg md:text-2xl font-bold leading-relaxed opacity-90 italic">
            “{report.finalConclusion}”
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-8 md:p-12 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-8 duration-700">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8 md:mb-10 text-center md:text-left">Verification Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Real Skills List */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-[10px] md:text-xs font-black text-green-600 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              REAL SKILLS
            </h4>
            <div className="space-y-2 md:space-y-3">
              {report.verifiedSkills.length > 0 ? report.verifiedSkills.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-green-50/50 border border-green-100 rounded-xl md:rounded-2xl">
                  <span className="font-bold text-slate-800 uppercase text-xs md:text-sm tracking-tight">{s.skill}</span>
                  <span className="text-[8px] md:text-[9px] font-black text-green-700 px-2 py-1 bg-white rounded-lg border border-green-100">CONFIRMED</span>
                </div>
              )) : <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest italic">None verified</p>}
            </div>
          </div>

          {/* Fake Skills List */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-[10px] md:text-xs font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              FAKE SKILLS
            </h4>
            <div className="space-y-2 md:space-y-3">
              {report.fakeSkills.length > 0 ? report.fakeSkills.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-red-50/50 border border-red-100 rounded-xl md:rounded-2xl">
                  <span className="font-bold text-slate-800 uppercase text-xs md:text-sm tracking-tight">{s.skill}</span>
                  <span className="text-[8px] md:text-[9px] font-black text-red-700 px-2 py-1 bg-white rounded-lg border border-red-100">FRAUD ALERT</span>
                </div>
              )) : <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest italic">None detected</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
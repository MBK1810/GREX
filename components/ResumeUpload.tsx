import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { performFullVerification } from '../geminiService';
import { ResumeAnalysis, User } from '../types';

interface FileData {
  name: string;
  data: string;
  mimeType: string;
}

interface Props {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
}

const ResumeUpload: React.FC<Props> = ({ onAnalysisComplete }) => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<FileData | null>(null);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<{title: string, msg: string} | null>(null);
  const navigate = useNavigate();

  const currentUser: User = JSON.parse(localStorage.getItem('grex_session') || '{}');

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError({ title: "FILE TOO LARGE", msg: "Please upload a resume under 5MB." });
        return;
      }
      const base64 = await fileToBase64(file);
      setResumeFile({
        name: file.name,
        data: base64,
        mimeType: file.type || 'application/octet-stream'
      });
      setResumeText('');
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    const hasResume = resumeText.trim().length > 0 || resumeFile !== null;
    const hasLinkedIn = linkedInUrl.trim().length > 0;

    if (!hasResume || !hasLinkedIn) {
      setError({ title: "MISSING DATA", msg: "MANDATORY: RESUME AND LINKEDIN URL ARE REQUIRED." });
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const resumeInput = resumeFile ? { data: resumeFile.data.split(',')[1], mimeType: resumeFile.mimeType } : resumeText;

      const result = await performFullVerification(
        resumeInput,
        linkedInUrl
      );
      
      const enrichedResult: ResumeAnalysis = {
        ...result,
        id: Date.now().toString(),
        userId: currentUser.username,
        timestamp: Date.now(),
        rawInputs: {
          resumeText: resumeText || (resumeFile ? `[FILE: ${resumeFile.name}]` : ''),
          linkedInUrl
        }
      };
      
      onAnalysisComplete(enrichedResult);
      navigate(`/report/${enrichedResult.id}`);
    } catch (err: any) {
      console.error(err);
      
      if (err.message?.includes('KEY_PROJECT_MISMATCH') || err.message?.includes('API_KEY_MISSING')) {
        setError({ 
          title: "API AUTHENTICATION FAILED", 
          msg: "The selected Google Cloud project is not configured for Gemini. Please re-connect with a paid project." 
        });
        if (window.aistudio) {
          window.aistudio.openSelectKey().then(() => window.location.reload());
        }
      } else {
        setError({ 
          title: "ANALYSIS ENGINE ERROR", 
          msg: err.message || "Unknown technical fault. Please ensure your project has Gemini API enabled." 
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 shadow-2xl border border-slate-100 min-h-[500px] flex flex-col relative overflow-hidden">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-8 space-y-8">
            <div className="w-20 h-20 md:w-24 md:h-24 relative">
              <div className="absolute inset-0 border-8 border-slate-100 rounded-full" />
              <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter animate-pulse">ANALYZING</h3>
              <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.4em]">CROSS-REFERENCING RESUME & LINKEDIN</p>
            </div>
          </div>
        )}

        <div className="space-y-10 md:space-y-12 flex-1">
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">CANDIDATE RESUME</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:min-h-48">
              <div className={`relative group border-2 rounded-2xl md:rounded-[2rem] overflow-hidden transition-all h-32 md:h-full ${resumeFile ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-50 border-slate-100 hover:border-indigo-600'}`}>
                <input
                  type="file"
                  onChange={handleResumeFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl mb-2 flex items-center justify-center ${resumeFile ? 'bg-white text-indigo-600' : 'bg-white text-slate-300'}`}>
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className={`font-black uppercase tracking-widest text-[9px] md:text-[10px] ${resumeFile ? 'text-white' : 'text-slate-400'}`}>
                    {resumeFile ? resumeFile.name : 'Upload Resume File'}
                  </p>
                </div>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => { setResumeText(e.target.value); setResumeFile(null); setError(null); }}
                placeholder="Or paste resume text content here..."
                className="w-full h-40 md:h-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-2xl md:rounded-[2rem] p-4 md:p-6 outline-none transition-all font-medium text-slate-900 resize-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">LINKEDIN PROFILE URL</h3>
            <div className="relative">
              <input
                type="url"
                value={linkedInUrl}
                onChange={(e) => { setLinkedInUrl(e.target.value); setError(null); }}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none font-bold text-slate-900 transition-all text-sm pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              Used by AI to cross-reference professional history and skill endorsements.
            </p>
          </div>
        </div>

        <div className="pt-10 md:pt-16 flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full md:w-auto bg-indigo-600 text-white px-12 md:px-24 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-lg md:text-xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            VERIFY AUTHENTICITY
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 p-6 rounded-[2rem] shadow-lg animate-in slide-in-from-top-4 duration-300 border-l-8 border-l-red-600">
          <div className="flex items-start gap-4">
            <div className="bg-red-600 text-white rounded-full p-2 animate-shake">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-red-700 font-black uppercase text-sm tracking-widest mb-1">{error.title}</h4>
              <p className="text-red-600 text-xs font-medium leading-relaxed uppercase opacity-80">{error.msg}</p>
              <div className="mt-4 pt-4 border-t border-red-100">
                <p className="text-[10px] font-black text-red-900 uppercase tracking-tighter">Diagnostic Hint:</p>
                <p className="text-[9px] font-bold text-red-700 uppercase leading-tight">
                  {"Please ensure the Gemini API is enabled in your Google Cloud Console."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
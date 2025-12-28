import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ResumeAnalysis, User } from './types';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import ReportView from './components/ReportView';
import AuthHome from './components/AuthHome';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import VerifiedHistory from './components/VerifiedHistory';

// Extend Window interface for AI Studio APIs
// Using AIStudio type to match the existing global declaration and avoid modifier mismatch.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}

const ProtectedRoute: React.FC<{ user: User | null; children: React.ReactNode }> = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const Navbar: React.FC<{ user: User | null; onLogout: () => void; onToggleMenu: () => void }> = ({ user, onLogout, onToggleMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  if (!user) return null;

  const showBackButton = ['/history', '/upload'].some(path => location.pathname === path) || location.pathname.startsWith('/report/');

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          {showBackButton ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black uppercase tracking-widest text-xs md:text-sm transition-all"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK
            </button>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter uppercase">GREX</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={onToggleMenu}
          className="p-2 md:p-3 hover:bg-slate-100 rounded-xl transition-all text-slate-600 active:scale-95"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void; user: User | null; onLogout: () => void }> = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-[85%] sm:w-80 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out p-6 md:p-8 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end items-center mb-8 md:mb-10">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-8 md:mb-10 pb-6 border-b border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User Profile</p>
          <p className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight truncate">{user.username}</p>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => { navigate('/history'); onClose(); }}
            className="flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-2xl transition-all text-slate-700 hover:text-indigo-600 group"
          >
            <svg className="w-5 h-5 opacity-40 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-bold uppercase tracking-widest text-xs">History</span>
          </button>

          <div className="mt-4 pt-4 border-t border-slate-50">
            <button 
              onClick={() => { onLogout(); onClose(); }}
              className="flex items-center gap-4 p-4 hover:bg-red-50 rounded-2xl transition-all text-slate-700 hover:text-red-600 group w-full text-left"
            >
              <svg className="w-5 h-5 opacity-40 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              <span className="font-bold uppercase tracking-widest text-xs">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="mt-auto pt-8 flex flex-col items-center gap-2 opacity-30">
          <p className="text-[8px] font-black text-slate-400 tracking-[0.4em] uppercase">@2025 GREX</p>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeAnalysis[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('grex_session');
    if (session) setCurrentUser(JSON.parse(session));
    const saved = localStorage.getItem('grex_resumes');
    if (saved) setResumes(JSON.parse(saved));

    const checkApiKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        // Fallback for local development or if API_KEY is somehow set globally
        setHasApiKey(!!process.env.API_KEY);
      }
    };
    checkApiKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('grex_resumes', JSON.stringify(resumes));
  }, [resumes]);

  const handleLogout = () => {
    localStorage.removeItem('grex_session');
    setCurrentUser(null);
  };

  const addResume = (resume: ResumeAnalysis) => {
    setResumes(prev => [resume, ...prev]);
  };

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-[2.5rem] border border-slate-700 shadow-2xl animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">System Access Required</h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              GREX Forensic Engine requires a valid Google Gemini API Key to cross-reference professional data.
            </p>
          </div>
          <button 
            onClick={handleConnectKey}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/10 active:scale-95"
          >
            Connect to Gemini Cloud
          </button>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Project billing must be enabled. See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 underline">docs</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar user={currentUser} onLogout={handleLogout} onToggleMenu={() => setIsMenuOpen(true)} />
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={currentUser} onLogout={handleLogout} />
        
        <main className={`flex-1 ${currentUser ? 'max-w-7xl mx-auto w-full py-6 md:py-12 px-4 sm:px-6 lg:px-8' : ''}`}>
          <Routes>
            <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <AuthHome />} />
            <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
            <Route path="/signup" element={<CreateAccount onSignup={setCurrentUser} />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute user={currentUser}>
                <Dashboard resumes={resumes} />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute user={currentUser}>
                <VerifiedHistory resumes={resumes} />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute user={currentUser}>
                <ResumeUpload onAnalysisComplete={addResume} />
              </ProtectedRoute>
            } />
            <Route path="/report/:id" element={
              <ProtectedRoute user={currentUser}>
                <ReportView resumes={resumes} />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
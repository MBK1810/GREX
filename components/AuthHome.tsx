
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <header className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase">GREX</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-16">
        <div className="max-w-md w-full text-center space-y-12">
          {/* Static Illustration */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center border border-slate-100 shadow-2xl">
              <svg className="w-24 h-24 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl tracking-widest uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              LOGIN
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-xl tracking-widest uppercase hover:bg-slate-50 transition-all active:scale-95"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </div>
      
      <footer className="p-8 flex flex-col items-center gap-2">
        <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">@2025 GREX</p>
        <p className="text-xs font-black text-slate-800 tracking-widest uppercase">POWERED BY TECH GREX</p>
      </footer>
    </div>
  );
};

export default AuthHome;

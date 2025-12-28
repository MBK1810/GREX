import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRecoveryEmail } from '../geminiService';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [aiDraft, setAiDraft] = useState<{subject: string, body: string} | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>(null);
  const [gmailConnected, setGmailConnected] = useState(false);

  const handleConnectGmail = () => {
    setIsSending(true);
    // Simulate OAuth connection delay
    setTimeout(() => {
      setGmailConnected(true);
      setIsSending(false);
    }, 1500);
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('grex_users') || '[]');
      const userExists = users.some((u: any) => u.email?.toLowerCase() === email.toLowerCase());

      const token = Math.random().toString(36).substr(2, 9);
      // Restored hash /#/ to support HashRouter paths
      const resetLink = `${window.location.origin}/#/reset-password/${token}`;
      
      const emailContent = await generateRecoveryEmail(email, resetLink);
      setAiDraft(emailContent);

      if (userExists) {
        const expiry = Date.now() + 15 * 60 * 1000;
        const resetData = JSON.parse(localStorage.getItem('grex_resets') || '{}');
        resetData[token] = { email: email.toLowerCase(), expiry };
        localStorage.setItem('grex_resets', JSON.stringify(resetData));
        setDemoToken(token);
      }

      setIsSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 text-slate-900">
      <button 
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        BACK TO LOGIN
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-100">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">ACCOUNT RECOVERY</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Verify your identity to regain access.
            </p>
          </div>

          {!gmailConnected ? (
            <div className="text-center space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Service Authorization Required</p>
                <button 
                  onClick={handleConnectGmail}
                  disabled={isSending}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-white border-2 border-slate-100 rounded-xl hover:border-indigo-600 transition-all active:scale-95 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">Connect Gmail Dispatcher</span>
                </button>
              </div>
              {isSending && (
                <div className="animate-pulse text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                  AUTHORIZING GMAIL ACCESS...
                </div>
              )}
            </div>
          ) : !isSent ? (
            <form onSubmit={handleDispatch} className="space-y-6">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
                  <span className="text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"/> GMAIL ACTIVE
                  </span>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSending}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl p-4 outline-none transition-all font-medium text-slate-900 placeholder-slate-300"
                  placeholder="Enter registered email"
                />
              </div>

              <button 
                type="submit"
                disabled={isSending}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest uppercase hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSending ? (
                   <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    DISPATCHING AI NOTIFICATION...
                   </>
                ) : 'SEND RECOVERY EMAIL'}
              </button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center space-y-2">
                <div className="text-green-600">
                  <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xs font-black text-green-800 uppercase tracking-widest">Notification Dispatched</h4>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest leading-relaxed">
                  A secure AI-generated recovery link has been sent to your Gmail.
                </p>
              </div>

              {aiDraft && (
                <div className="bg-slate-900 rounded-2xl overflow-hidden">
                  <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gmail Preview (Simulated)</span>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500"/>
                      <div className="w-2 h-2 rounded-full bg-amber-500"/>
                      <div className="w-2 h-2 rounded-full bg-green-500"/>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Subject: {aiDraft.subject}</p>
                    <div 
                      className="text-[11px] text-slate-300 bg-slate-800/50 p-4 rounded-lg border border-slate-800 overflow-y-auto max-h-48 scrollbar-hide"
                      dangerouslySetInnerHTML={{ __html: aiDraft.body }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {demoToken && (
                  <button 
                    onClick={() => navigate(`/reset-password/${demoToken}`)}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-slate-800 transition-all shadow-xl"
                  >
                    Simulate Link Activation
                  </button>
                )}
                <button 
                  onClick={() => setIsSent(false)}
                  className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                >
                  Return to form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
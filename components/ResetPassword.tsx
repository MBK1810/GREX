
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [targetEmail, setTargetEmail] = useState<string | null>(null);

  useEffect(() => {
    const resets = JSON.parse(localStorage.getItem('grex_resets') || '{}');
    const resetInfo = resets[token || ''];

    if (!resetInfo || resetInfo.expiry < Date.now()) {
      setError('INVALID OR EXPIRED RECOVERY TOKEN');
    } else {
      setTargetEmail(resetInfo.email);
    }
  }, [token]);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError('PASSWORD IS REQUIRED');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('PASSWORDS DO NOT MATCH');
      return;
    }

    // Update user password in local storage
    const users = JSON.parse(localStorage.getItem('grex_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === targetEmail);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('grex_users', JSON.stringify(users));
      
      // Clear used token
      const resets = JSON.parse(localStorage.getItem('grex_resets') || '{}');
      delete resets[token || ''];
      localStorage.setItem('grex_resets', JSON.stringify(resets));
      
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError('USER NODE NOT FOUND');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100 scale-110">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">SUCCESS</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
            Your credentials have been updated. Redirecting to terminal...
          </p>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-[progress_3s_linear]" style={{ width: '100%' }}></div>
          </div>
        </div>
        <style>{`@keyframes progress { from { width: 0%; } to { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 text-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">NEW CREDENTIALS</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Secure update protocol</p>
          </div>

          {error && !targetEmail ? (
            <div className="space-y-6 text-center">
              <p className="text-red-600 text-[10px] font-black tracking-widest uppercase py-4 bg-red-50 rounded-xl">{error}</p>
              <button 
                onClick={() => navigate('/forgot-password')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs"
              >
                REQUEST NEW LINK
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl p-4 outline-none transition-all font-medium text-slate-900 placeholder-slate-300"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl p-4 outline-none transition-all font-medium text-slate-900 placeholder-slate-300"
                  placeholder="Repeat new password"
                />
              </div>

              {error && <p className="text-red-600 text-[10px] font-black text-center tracking-widest uppercase pt-2">{error}</p>}

              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest uppercase hover:bg-indigo-700 transition-all shadow-md active:scale-95 mt-4"
              >
                UPDATE PASSWORD
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

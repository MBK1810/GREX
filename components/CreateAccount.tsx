
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface Props {
  onSignup: (user: User) => void;
}

const CreateAccount: React.FC<Props> = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('ALL FIELDS ARE MANDATORY');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('grex_users') || '[]');
    
    // Strict Case-Insensitive Duplicate Check
    const userExists = users.some(u => u.username.toLowerCase() === formData.username.toLowerCase());
    
    if (userExists) {
      setError('USER ID ALREADY REGISTERED. PLEASE LOG IN OR USE A DIFFERENT ID.');
      return;
    }

    const newUser: User = { ...formData };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('grex_users', JSON.stringify(updatedUsers));
    localStorage.setItem('grex_session', JSON.stringify(newUser));
    
    onSignup(newUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 text-slate-900">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        BACK
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="text-center space-y-3">
             <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">NEW USER</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique Username</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl p-4 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 shadow-inner"
                placeholder="Identification Name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl p-4 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 shadow-inner"
                placeholder="Secure Password"
              />
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-red-600 text-[10px] font-black text-center tracking-widest uppercase">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black tracking-[0.2em] uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-50 active:scale-95 text-xs"
            >
              CREATE
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => navigate('/login')}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Already a user? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;

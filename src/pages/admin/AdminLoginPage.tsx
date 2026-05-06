import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../../admin.css';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(import.meta.env.VITE_TEST_USER_EMAIL || '');
  const [password, setPassword] = useState(import.meta.env.VITE_TEST_USER_PASSWORD || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-platform min-h-screen flex items-center justify-center bg-[#0B0C10] px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="text-3xl font-bold text-white mb-2">
            <span className="text-[#00FFC2]">MONETIZATOR</span>
            <span className="opacity-50">.</span>
            <span className="text-xs uppercase tracking-[0.3em] opacity-50 block mt-1">Command Center</span>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00FFC2]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#00FFC2]/50 outline-none transition-all"
                  placeholder="sergey@monetizator.pro"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1 mb-2 block">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#00FFC2]/50 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full admin-button-primary flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  Войти в систему
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-600 text-xs font-mono">
          &copy; 2026 Money Matrix Protocol v2.4.0
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { mockProfiles } from '../data/mockData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('aditya.verma@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiClient.login(email);
      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleQuickPersonaSelect = (userEmail: string) => {
    setEmail(userEmail);
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">GenZ Connectors</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
        <p className="mt-1 text-xs text-zinc-400">
          Or{' '}
          <Link to="/signup" className="font-medium text-amber-400 hover:text-amber-300">
            create a new builder profile
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#15181e] py-8 px-6 sm:px-8 border border-[#232730] rounded-2xl shadow-xl space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-zinc-300">Password</label>
                <span className="text-[11px] text-zinc-500 cursor-not-allowed">Forgot password?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Social placeholder */}
          <div className="pt-2">
            <div className="relative flex justify-center text-[10px] uppercase font-mono text-zinc-500">
              <span className="bg-[#15181e] px-2 text-zinc-400">Or continue with</span>
            </div>
            <button
              type="button"
              onClick={() => handleLogin({ preventDefault: () => {} } as any)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#0c0e12] hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              Google Account (Cognito Federated)
            </button>
          </div>

          {/* Quick Mock Persona Pickers */}
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-[11px] font-mono text-zinc-400 mb-2">Dev Quick Switch (Mock Mode):</p>
            <div className="grid grid-cols-2 gap-1.5">
              {mockProfiles.slice(0, 4).map((p) => (
                <button
                  key={p.userId}
                  type="button"
                  onClick={() => handleQuickPersonaSelect(`${p.name.toLowerCase().replace(' ', '.')}@example.com`)}
                  className="text-left p-2 rounded-lg bg-[#0c0e12] hover:bg-zinc-900 border border-zinc-800 text-[11px] truncate text-zinc-300"
                >
                  <span className="font-medium text-white block truncate">{p.name}</span>
                  <span className="text-[10px] text-zinc-400 truncate block">{p.skills[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Dev Mode: Passwords are never stored in localStorage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

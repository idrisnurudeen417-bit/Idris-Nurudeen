import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onAuthenticated: (userData: { username: string; email: string; title: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAuthenticated }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('Alhaji');
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Taken usernames registry stored locally
  const getTakenUsernames = (): string[] => {
    try {
      const stored = localStorage.getItem('life_in_kano_usernames');
      return stored ? JSON.parse(stored) : ['dan_kano', 'dantata_vip', 'kano_prince', 'aliko_m'];
    } catch {
      return ['dan_kano'];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide a valid email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!ageConfirmed) {
      setError('You must confirm you are 15+ years of age to enter Life in Kano.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (cleanUsername.length < 3) {
      setError('Username must be at least 3 characters (letters, numbers, underscores).');
      return;
    }

    const taken = getTakenUsernames();

    if (isRegistering) {
      if (taken.includes(cleanUsername)) {
        setError(`Username "${cleanUsername}" is already claimed in this world! Please choose a unique name.`);
        return;
      }
      taken.push(cleanUsername);
      localStorage.setItem('life_in_kano_usernames', JSON.stringify(taken));
    }

    // Save active session
    const session = { username: cleanUsername, email, title };
    localStorage.setItem('life_in_kano_session', JSON.stringify(session));

    onAuthenticated(session);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-zinc-950 border border-amber-600/30 rounded-2xl p-6 shadow-2xl text-white relative overflow-hidden">
        {/* Subtle decorative gold glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-400 mb-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>15+ · 000000000000000000000000</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-zinc-100 font-mono">
            000000000000000000000000
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sign in with unique username to access world simulation
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Quick Owner Access for Idris */}
        <button
          type="button"
          onClick={() => {
            onAuthenticated({
              username: 'idris_sovereign',
              email: 'Idrisnurudeen417@gmail.com',
              title: 'Alhaji Senator',
            });
          }}
          className="w-full mb-4 py-2.5 px-3 bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 hover:border-amber-400 border border-amber-500/60 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-between shadow-lg transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="truncate font-mono">Idris (₦1,000,000,000,000,000,000,000,000)</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono font-black">
            Idrisnurudeen417
          </span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Honorary Title
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Alhaji', 'Senator', 'Chief', 'Prince'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTitle(t)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all border ${
                    title === t
                      ? 'bg-amber-600 text-white border-amber-500 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
              <span>Unique Global Username</span>
              <span className="text-[10px] text-amber-400/80">Never re-used</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. kano_billionaire"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Age Check */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0"
            />
            <span className="text-[11px] text-zinc-400">
              I certify I am 15 years of age or older (Age-restricted simulation)
            </span>
          </label>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-bold rounded-xl text-sm shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRegistering ? 'CLAIM USERNAME & ENTER KANO' : 'SIGN IN & ENTER'}</span>
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-500 flex items-center justify-between">
          <span>{isRegistering ? 'Already registered an account?' : 'Need a new unique citizen username?'}</span>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="text-amber-400 hover:underline font-medium ml-2"
          >
            {isRegistering ? 'Sign In' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

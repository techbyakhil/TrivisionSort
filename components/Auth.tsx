import React, { useState } from 'react';
import { Button } from './Button';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const user = await authService.login(username, password);
        onLogin(user);
      } else {
        const user = await authService.register(username, password);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full px-6 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-light text-neutral-900 dark:text-white mb-2">Access Control</h2>
            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">
                {isLogin ? 'Authenticate Identity' : 'Register New Personnel'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500">
                User Identification
            </label>
            <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-3 text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors font-mono"
                placeholder="ENTER_ID"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500">
                Access Key
            </label>
            <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-3 text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors font-mono"
                placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-mono">
                ERROR: {error}
            </div>
          )}

          <div className="pt-8">
            <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
            >
                {loading ? 'PROCESSING...' : (isLogin ? 'INITIATE SESSION' : 'CREATE RECORD')}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-xs font-mono text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors uppercase tracking-widest"
            >
                {isLogin ? '[ Switch to Registration ]' : '[ Switch to Login ]'}
            </button>
        </div>
      </div>
    </div>
  );
};
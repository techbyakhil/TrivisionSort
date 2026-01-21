import React, { useState, useEffect } from 'react';
import { AppMode, User } from './types';
import { ScanMode } from './components/ScanMode';
import { UploadMode } from './components/UploadMode';
import { Auth } from './components/Auth';
import { authService } from './services/authService';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Toggle dark mode class on html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    setMode(AppMode.HOME);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMode(AppMode.HOME);
  };

  const renderContent = () => {
    if (!user) {
        return <Auth onLogin={handleLogin} />;
    }

    switch (mode) {
      case AppMode.SCAN:
        return <ScanMode onStop={() => setMode(AppMode.HOME)} />;
      case AppMode.UPLOAD:
        return <UploadMode onBack={() => setMode(AppMode.HOME)} />;
      case AppMode.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 py-20 animate-fade-in">
             <div className="w-full text-center space-y-6 mb-24">
                <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-neutral-900 dark:text-white">
                    TriVision Sort
                </h2>
                <p className="text-neutral-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                    Advanced computer vision for material classification. Distinguish wet, dry, and burnable waste with high-fidelity AI models.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-900 w-full border border-neutral-200 dark:border-neutral-900">
                {/* Card 1 */}
                <div 
                    className="bg-white dark:bg-black p-12 flex flex-col justify-between h-96 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors cursor-pointer group relative overflow-hidden" 
                    onClick={() => setMode(AppMode.UPLOAD)}
                >
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black dark:text-white">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </div>
                    <div>
                        <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-2 block">Mode 01</span>
                        <h3 className="text-3xl text-neutral-900 dark:text-white font-medium tracking-tight">Static Audit</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all text-neutral-900 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
                            High-resolution analysis of existing datasets. Supports PNG and JPEG formats.
                        </p>
                    </div>
                </div>

                {/* Card 2 */}
                <div 
                    className="bg-white dark:bg-black p-12 flex flex-col justify-between h-96 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors cursor-pointer group relative overflow-hidden" 
                    onClick={() => setMode(AppMode.SCAN)}
                >
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black dark:text-white">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </div>
                    <div>
                        <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-2 block">Mode 02</span>
                        <h3 className="text-3xl text-neutral-900 dark:text-white font-medium tracking-tight">Live Recon</h3>
                    </div>
                     <div className="space-y-4">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all text-neutral-900 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
                            Real-time inference using device optics. Low latency object discrimination.
                        </p>
                    </div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white flex flex-col font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference px-8 py-6 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto cursor-pointer" onClick={() => setMode(AppMode.HOME)}>
             <div className="w-6 h-6 bg-white rounded-sm"></div>
             <h1 className="text-sm font-bold tracking-widest uppercase text-white">TriVision Sort</h1>
          </div>
          
          <div className="flex gap-6 items-center pointer-events-auto">
            {user && (
                 <span className="hidden md:inline text-xs font-mono text-neutral-300 uppercase">USR: {user.username}</span>
            )}
            <span className="hidden md:inline text-xs font-mono text-neutral-300">SYS.STATUS: ONLINE</span>
            
            {/* Theme Toggle */}
            <button 
                onClick={() => setIsDark(!isDark)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-500 hover:bg-white hover:text-black transition-all text-white"
                aria-label="Toggle Theme"
            >
                {isDark ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                )}
            </button>
            
            {/* Logout Button */}
            {user && (
                <button 
                    onClick={handleLogout}
                    className="text-xs font-mono text-white hover:text-red-400 transition-colors uppercase tracking-widest border border-white/20 px-3 py-1 rounded-sm"
                >
                    LOGOUT
                </button>
            )}
          </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            <p className="text-xs text-neutral-500 font-mono">
                © 2026 TRIVISION SORT
            </p>
            <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
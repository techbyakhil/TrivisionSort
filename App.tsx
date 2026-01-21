import React, { useState, useEffect } from 'react';
import { AppMode, User } from './types';
import { ScanMode } from './components/ScanMode';
import { UploadMode } from './components/UploadMode';
import { HistoryMode } from './components/HistoryMode';
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
      case AppMode.HISTORY:
        return <HistoryMode onBack={() => setMode(AppMode.HOME)} />;
      case AppMode.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full min-h-[60vh] animate-fade-in px-6">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-neutral-900 dark:text-white mb-4">
                TRIVISION<br/><span className="font-bold">SORT</span>
              </h1>
              <p className="text-sm font-mono text-neutral-500 uppercase tracking-[0.2em]">
                AI-Driven Waste Classification System
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {/* Scan Card */}
              <button 
                onClick={() => setMode(AppMode.SCAN)}
                className="group relative h-64 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-8 flex flex-col items-center justify-center gap-6 hover:border-neutral-900 dark:hover:border-white transition-all duration-300"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-neutral-900 dark:bg-white"></div>
                </div>
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-neutral-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M3 3h6v6H3V3zm12 0h6v6h-6V3zm-12 12h6v6H3v-6zm12 0h6v6h-6v-6z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-1">INITIATE SCAN</h3>
                    <p className="text-xs font-mono text-neutral-500 uppercase">Real-time Analysis</p>
                </div>
              </button>

              {/* Upload Card */}
              <button 
                onClick={() => setMode(AppMode.UPLOAD)}
                className="group relative h-64 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-8 flex flex-col items-center justify-center gap-6 hover:border-neutral-900 dark:hover:border-white transition-all duration-300"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-neutral-900 dark:bg-white"></div>
                </div>
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-neutral-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-1">UPLOAD SOURCE</h3>
                    <p className="text-xs font-mono text-neutral-500 uppercase">File Evaluation</p>
                </div>
              </button>
              
              {/* History Card */}
              <button 
                onClick={() => setMode(AppMode.HISTORY)}
                className="group relative h-64 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-8 flex flex-col items-center justify-center gap-6 hover:border-neutral-900 dark:hover:border-white transition-all duration-300"
              >
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-neutral-900 dark:bg-white"></div>
                </div>
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-neutral-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-1">DATA LOGS</h3>
                    <p className="text-xs font-mono text-neutral-500 uppercase">Analysis History</p>
                </div>
              </button>
            </div>
            
            <div className="mt-16 text-xs font-mono text-neutral-400">
                SYSTEM READY. WAITING FOR INPUT.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="font-bold text-lg tracking-tighter cursor-pointer"
            onClick={() => setMode(AppMode.HOME)}
          >
            TRIVISION<span className="font-light text-neutral-500">SORT</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
                onClick={() => setIsDark(!isDark)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
                {isDark ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
            </button>
            
            {user && (
                <div className="flex items-center gap-4 border-l border-neutral-200 dark:border-neutral-800 pl-6">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Operator</div>
                        <div className="text-sm font-bold">{user.username}</div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-xs font-mono uppercase text-red-500 hover:text-red-600 tracking-widest"
                    >
                        [ Logout ]
                    </button>
                </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 w-full min-h-screen flex flex-col">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Send, User, LogOut, Code2, LayoutDashboard, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'docs';
  setCurrentView: (view: 'landing' | 'dashboard' | 'docs') => void;
  user: { id: string; email: string; name: string } | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, user, onOpenAuth, onLogout }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        {/* Brand Logo & Name (LuluFiles Marque Style) */}
        <div
          onClick={() => setCurrentView('landing')}
          className="brand-mark"
          style={{ cursor: 'pointer' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius)',
            background: 'var(--c-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}>
            <Send size={18} />
          </div>
          <span className="marque brand-nom">
            LuluMails
          </span>
        </div>

        {/* Main Navigation Links */}
        <nav className="site-nav">
          <button
            onClick={() => setCurrentView('landing')}
            style={{
              color: currentView === 'landing' ? 'var(--c-brand-strong)' : 'var(--c-ink-soft)',
              fontWeight: currentView === 'landing' ? 600 : 500,
            }}
          >
            Accueil & Tarifs
          </button>

          <button
            onClick={() => setCurrentView('docs')}
            style={{
              color: currentView === 'docs' ? 'var(--c-brand-strong)' : 'var(--c-ink-soft)',
              fontWeight: currentView === 'docs' ? 600 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Code2 size={16} />
            <span>Documentation Dev</span>
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            style={{
              color: currentView === 'dashboard' ? 'var(--c-brand-strong)' : 'var(--c-ink-soft)',
              fontWeight: currentView === 'dashboard' ? 600 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LayoutDashboard size={16} />
            <span>Console Dashboard</span>
          </button>
        </nav>

        {/* Auth Actions & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline btn-sm btn-icon"
            title={`Basculer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
            style={{ padding: '0 8px', height: '32px' }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} color="#fbbf24" />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-ink)' }}>
                👋 {user.name}
              </span>
              <button onClick={onLogout} className="btn btn-outline btn-sm">
                <LogOut size={14} />
                <span>Déconnexion</span>
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => onOpenAuth('login')} className="btn btn-outline btn-sm">
                Connexion
              </button>
              <button onClick={() => onOpenAuth('register')} className="btn btn-brand btn-sm">
                S'inscrire 0€
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

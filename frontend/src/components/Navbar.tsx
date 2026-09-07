import React from 'react';
import { Send, User, LogOut, Code2, LayoutDashboard, Sparkles, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'docs';
  setCurrentView: (view: 'landing' | 'dashboard' | 'docs') => void;
  user: { id: string; email: string; name: string } | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, user, onOpenAuth, onLogout }) => {
  return (
    <header style={{
      background: 'var(--c-surface)',
      borderBottom: '1px solid var(--c-line)',
      padding: '0 var(--space-6)',
      height: 'var(--header-h)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand Logo */}
      <div
        onClick={() => setCurrentView('landing')}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}
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
        <span style={{ fontFamily: 'var(--font-brand)', fontSize: '1.6rem', color: 'var(--c-ink)' }}>
          LuluMails
        </span>
      </div>

      {/* Main Navigation Links */}
      <nav style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentView('landing')}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'landing' ? 'var(--c-brand-strong)' : 'var(--c-muted)',
            fontWeight: currentView === 'landing' ? 600 : 500,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
          }}
        >
          Accueil & Tarifs
        </button>

        <button
          onClick={() => setCurrentView('docs')}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'docs' ? 'var(--c-brand-strong)' : 'var(--c-muted)',
            fontWeight: currentView === 'docs' ? 600 : 500,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
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
            background: currentView === 'dashboard' ? 'var(--c-brand-soft)' : 'transparent',
            border: '1px solid var(--c-line)',
            color: currentView === 'dashboard' ? 'var(--c-brand-strong)' : 'var(--c-ink)',
            padding: '6px 14px',
            borderRadius: 'var(--radius)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <LayoutDashboard size={16} />
          <span>Console Dashboard</span>
        </button>
      </nav>

      {/* Auth Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-ink)' }}>
              👋 {user.name}
            </span>
            <button onClick={onLogout} className="btn-secondary" style={{ padding: '6px 12px' }}>
              <LogOut size={14} />
              <span>Déconnexion</span>
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => onOpenAuth('login')} className="btn-secondary" style={{ padding: '6px 14px' }}>
              Connexion
            </button>
            <button onClick={() => onOpenAuth('register')} className="btn-primary" style={{ padding: '6px 14px' }}>
              S'inscrire 0€
            </button>
          </>
        )}
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Key, Server, FileCode, History, BookOpen, Sun, Moon, Send } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'keys', label: 'Clés API Client', icon: Key },
    { id: 'providers', label: 'Providers & BYOK', icon: Server },
    { id: 'templates', label: 'Templates Mail', icon: FileCode },
    { id: 'logs', label: 'Logs d\'envoi', icon: History },
    { id: 'docs', label: 'Documentation Dev', icon: BookOpen },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: 'var(--sidebar-w)',
        background: 'var(--c-surface)',
        borderRight: '1px solid var(--c-line)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-5)',
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius)',
            background: 'var(--c-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}>
            <Send size={20} />
          </div>
          <span style={{
            fontFamily: 'var(--font-brand)',
            fontSize: '1.6rem',
            fontWeight: 400,
            color: 'var(--c-ink)',
            letterSpacing: '-0.5px',
          }}>
            LuluMails
          </span>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  background: isActive ? 'var(--c-brand-soft)' : 'transparent',
                  color: isActive ? 'var(--c-brand-strong)' : 'var(--c-ink-soft)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--motion) var(--ease)',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dark / Light Mode Toggle */}
        <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--c-line)' }}>
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>Mode {theme === 'light' ? 'Sombre' : 'Clair'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: 'var(--space-6)', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

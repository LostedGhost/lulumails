import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { ApiKeys } from './pages/ApiKeys';
import { Providers } from './pages/Providers';
import { Templates } from './pages/Templates';
import { Logs } from './pages/Logs';
import { Docs } from './pages/Docs';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'docs'>('landing');
  const [dashboardTab, setDashboardTab] = useState('overview');
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData: { id: string; email: string; name: string }) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const renderDashboardTab = () => {
    switch (dashboardTab) {
      case 'overview':
        return <Overview />;
      case 'keys':
        return <ApiKeys />;
      case 'providers':
        return <Providers />;
      case 'templates':
        return <Templates />;
      case 'logs':
        return <Logs />;
      case 'docs':
        return <Docs />;
      default:
        return <Overview />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {currentView === 'landing' && (
        <LandingPage
          onGoToDashboard={() => setCurrentView('dashboard')}
          onOpenAuth={handleOpenAuth}
          onGoToDocs={() => setCurrentView('docs')}
        />
      )}

      {currentView === 'docs' && (
        <div style={{ padding: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Docs />
        </div>
      )}

      {currentView === 'dashboard' && (
        <div style={{ flex: 1 }}>
          <Layout activeTab={dashboardTab} setActiveTab={setDashboardTab}>
            {renderDashboardTab()}
          </Layout>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;

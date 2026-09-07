import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { ApiKeys } from './pages/ApiKeys';
import { Providers } from './pages/Providers';
import { Templates } from './pages/Templates';
import { Logs } from './pages/Logs';
import { Docs } from './pages/Docs';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
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

  return <Layout activeTab={activeTab} setActiveTab={setActiveTab}>{renderContent()}</Layout>;
};

export default App;

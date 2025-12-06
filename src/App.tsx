import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import AuctionList from './components/AuctionList';
import Navigation from './components/Navigation';

type View = 'auctions' | 'dashboard';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<View>('auctions');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Not logged in → show login/register
  if (!user) {
    return <AuthForm mode={authMode} onModeChange={setAuthMode} />;
  }

  const role = user.role?.toLowerCase();
  const isAdmin = role === 'admin';

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        // ONE SINGLE DASHBOARD for both admin & customer
        // (Dashboard itself will show admin-specific bits if needed)
        return <Dashboard />;

      case 'auctions':
      default:
        return <AuctionList />;
    }
  };

  return (
    <Layout>
      {/* Navigation already hides Dashboard tab for non-admins */}
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {renderCurrentView()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

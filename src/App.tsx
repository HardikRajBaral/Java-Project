import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
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

  // Not logged in -> show login / register form
  if (!user) {
    return <AuthForm mode={authMode} onModeChange={setAuthMode} />;
  }

  const role = user.role?.toLowerCase();
  const isAdmin = role === 'admin';

  const renderCurrentView = () => {
    // If non-admin somehow has 'dashboard' view, force them back to auctions
    if (!isAdmin && currentView === 'dashboard') {
      return <AuctionList />;
    }

    switch (currentView) {
      case 'dashboard':
        // Admin’s dashboard = AdminPanel
        return isAdmin ? <AdminPanel /> : <Dashboard />; // fallback, but customer never sees button

      case 'auctions':
      default:
        return <AuctionList />;
    }
  };

  return (
    <Layout>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
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

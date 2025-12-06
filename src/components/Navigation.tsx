import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role?.toLowerCase();
  const isAdmin = role === 'admin';

  const baseButton =
    'px-4 py-2 text-sm font-medium rounded-md border shadow-sm transition duration-150';
  const active = 'bg-blue-600 text-white border-blue-600 shadow';
  const inactive = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100';

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-3">

        {/* Auctions (everyone) */}
        <button
          onClick={() => onViewChange('auctions')}
          className={`${baseButton} ${currentView === 'auctions' ? active : inactive}`}
        >
          Auctions
        </button>

        {/* Dashboard ONLY for admin */}
        {isAdmin && (
          <button
            onClick={() => onViewChange('dashboard')}
            className={`${baseButton} ${currentView === 'dashboard' ? active : inactive}`}
          >
            Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;

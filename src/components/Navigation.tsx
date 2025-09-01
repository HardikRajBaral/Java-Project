import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Home, Gavel, Settings, User, Plus } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth();

  const customerNavItems = [
    { id: 'auctions', label: 'Browse Auctions', icon: Gavel },
    { id: 'dashboard', label: 'My Dashboard', icon: User },
  ];

  const adminNavItems = [
    { id: 'auctions', label: 'Browse Auctions', icon: Gavel },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : customerNavItems;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  currentView === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
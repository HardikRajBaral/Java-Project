import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuctionItem } from '../types';
import { Check, X, Eye, Users, Gavel, Clock } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const [pendingAuctions, setPendingAuctions] = useState<AuctionItem[]>([]);
  const [allAuctions, setAllAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    fetchPendingAuctions();
    fetchAllAuctions();
  }, []);

  const fetchPendingAuctions = async () => {
    try {
      const response = await fetch('/api/admin/pending-auctions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingAuctions(data);
      }
    } catch (error) {
      console.error('Error fetching pending auctions:', error);
    }
  };

  const fetchAllAuctions = async () => {
    try {
      const response = await fetch('/api/admin/all-auctions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllAuctions(data);
      }
    } catch (error) {
      console.error('Error fetching all auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (auctionId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/auctions/${auctionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchPendingAuctions();
        fetchAllAuctions();
      }
    } catch (error) {
      console.error('Error updating auction status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage auction listings and oversee platform activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-3xl font-bold text-amber-600">{pendingAuctions.length}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Auctions</p>
              <p className="text-3xl font-bold text-green-600">
                {allAuctions.filter(a => a.status === 'active').length}
              </p>
            </div>
            <Gavel className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Auctions</p>
              <p className="text-3xl font-bold text-blue-600">{allAuctions.length}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Value</p>
              <p className="text-3xl font-bold text-emerald-600">
                ${allAuctions.reduce((sum, a) => sum + a.current_price, 0).toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approval ({pendingAuctions.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Auctions ({allAuctions.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                  <p className="text-gray-600">All auction listings are up to date.</p>
                </div>
              ) : (
                pendingAuctions.map((auction) => (
                  <div key={auction.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={auction.image_url}
                      alt={auction.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{auction.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{auction.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Starting: ${auction.starting_price}</span>
                        <span>Category: {auction.category}</span>
                        <span>Seller: {auction.seller_username}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproval(auction.id, 'approved')}
                        className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleApproval(auction.id, 'rejected')}
                        className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allAuctions.map((auction) => (
                <div key={auction.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <img
                    src={auction.image_url}
                    alt={auction.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">{auction.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      ${auction.current_price.toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(auction.status)}`}>
                      {auction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
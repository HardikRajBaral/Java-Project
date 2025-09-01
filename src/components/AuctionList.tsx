import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuctionItem } from '../types';
import AuctionCard from './AuctionCard';
import BidModal from './BidModal';
import { Search, Filter } from 'lucide-react';

const AuctionList: React.FC = () => {
  const { token } = useAuth();
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);

  const categories = [
    'Electronics',
    'Art & Collectibles',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Automotive',
    'Books',
    'Jewelry',
    'Other'
  ];

  useEffect(() => {
    fetchActiveAuctions();
  }, []);

  useEffect(() => {
    let filtered = auctions;

    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(auction => auction.category === selectedCategory);
    }

    setFilteredAuctions(filtered);
  }, [auctions, searchTerm, selectedCategory]);

  const fetchActiveAuctions = async () => {
    try {
      const response = await fetch('/api/auctions/active', {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setAuctions(data);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBid = (auctionId: string) => {
    setSelectedAuction(auctionId);
  };

  const handleBidSuccess = () => {
    setSelectedAuction(null);
    fetchActiveAuctions();
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
        <h1 className="text-3xl font-bold text-gray-900">Live Auctions</h1>
        <p className="text-gray-600 mt-1">Discover and bid on amazing items</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12">
          <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onBid={handleBid}
            />
          ))}
        </div>
      )}

      {selectedAuction && (
        <BidModal
          auctionId={selectedAuction}
          onClose={() => setSelectedAuction(null)}
          onSuccess={handleBidSuccess}
        />
      )}
    </div>
  );
};

export default AuctionList;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuctionItem, Bid } from '../types';
import { X, DollarSign, Clock, TrendingUp } from 'lucide-react';

interface BidModalProps {
  auctionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const BidModal: React.FC<BidModalProps> = ({ auctionId, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctionDetails();
    fetchBidHistory();
  }, [auctionId]);

  const fetchAuctionDetails = async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuction(data);
        setBidAmount((data.current_price + 1).toString());
      }
    } catch (error) {
      console.error('Error fetching auction details:', error);
    }
  };

  const fetchBidHistory = async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}/bids`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBids(data);
      }
    } catch (error) {
      console.error('Error fetching bid history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const amount = parseFloat(bidAmount);
    if (!auction || amount <= auction.current_price) {
      setError('Bid must be higher than current price');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/auctions/${auctionId}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place bid');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!auction) return '';
    
    const now = new Date();
    const end = new Date(auction.auction_end);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Auction ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading || !auction) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Place Bid</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <img
              src={auction.image_url}
              alt={auction.title}
              className="w-24 h-24 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{auction.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Current price: ${auction.current_price.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Ends in: {getTimeRemaining()}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitBid} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Your Bid Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="bidAmount"
                  type="number"
                  step="0.01"
                  min={auction.current_price + 0.01}
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder={`Minimum: $${(auction.current_price + 0.01).toFixed(2)}`}
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
          </form>

          {bids.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Bid History</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bids.slice(0, 10).map((bid) => (
                  <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{bid.bidder_username}</span>
                    <div className="text-right">
                      <span className="font-bold text-green-600">${bid.amount.toLocaleString()}</span>
                      <div className="text-xs text-gray-500">
                        {new Date(bid.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidModal;
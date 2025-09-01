import React from 'react';
import { AuctionItem } from '../types';
import { Clock, DollarSign, User, Eye } from 'lucide-react';

interface AuctionCardProps {
  auction: AuctionItem;
  showActions?: boolean;
  onBid?: (auctionId: string) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, showActions = false, onBid }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isAuctionActive = () => {
    return auction.status === 'active' && new Date(auction.auction_end) > new Date();
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(auction.auction_end);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={auction.image_url}
          alt={auction.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">{auction.title}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(auction.status)}`}>
            {auction.status}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{auction.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Current:</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              ${auction.current_price.toLocaleString()}
            </span>
          </div>
          
          {isAuctionActive() && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Ends in:</span>
              </div>
              <span className="text-sm font-medium text-red-600">
                {getTimeRemaining()}
              </span>
            </div>
          )}
          
          {showActions && auction.seller_username && (
            <div className="flex items-center space-x-1 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-sm">by {auction.seller_username}</span>
            </div>
          )}
        </div>
        
        {!showActions && isAuctionActive() && onBid && (
          <button
            onClick={() => onBid(auction.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Place Bid
          </button>
        )}
        
        {showActions && (
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200">
              <Eye className="h-4 w-4" />
              <span>View</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionCard;
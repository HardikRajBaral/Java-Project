import React, { useEffect, useState } from 'react';
import { AuctionItem } from '../types';

const AuctionList: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const res = await fetch('http://localhost:8080/api/auctions/active');

        if (!res.ok) {
          const text = await res.text();
          console.error('Failed to load auctions:', res.status, text);
          setErrorMsg('Failed to load auctions from server.');
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error('Expected array from /api/auctions/active, got:', data);
          setErrorMsg('Invalid auctions response from server.');
          return;
        }

        setAuctions(data as AuctionItem[]);
      } catch (err) {
        console.error('Error loading auctions:', err);
        setErrorMsg('Network error while loading auctions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading auctions...</div>;
  }

  if (errorMsg) {
    return <div className="p-4 text-red-600">{errorMsg}</div>;
  }

  if (auctions.length === 0) {
    return <div className="p-4 text-gray-600">No active auctions found.</div>;
  }

  return (
    <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <div key={auction.id} className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">{auction.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{auction.description}</p>
          <p className="text-sm text-gray-800">
            Current price:{' '}
            <span className="font-bold">
              Rs. {auction.current_price ?? auction.starting_price}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default AuctionList;

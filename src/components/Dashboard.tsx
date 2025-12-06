// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import api from "../api";
import AuctionForm from "./AuctionForm";

interface DashboardStats {
  totalListings: number;
  activeAuctions: number;
  pendingApproval: number;
  totalValue: number;
}

interface AuctionRow {
  id: string;
  title: string;
  current_price: number;
  status: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeAuctions: 0,
    pendingApproval: 0,
    totalValue: 0,
  });
  const [auctions, setAuctions] = useState<AuctionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auctions/my-auctions");
      const list: any[] = res.data || [];

      const totalListings = list.length;
      const activeAuctions = list.filter((a) => a.status === "active").length;
      const pendingApproval = list.filter(
        (a) => a.status === "pending" || a.status === "PENDING"
      ).length;
      const totalValue = list.reduce(
        (sum, a) => sum + (a.current_price || 0),
        0
      );

      setStats({
        totalListings,
        activeAuctions,
        pendingApproval,
        totalValue,
      });

      setAuctions(
        list.map((a) => ({
          id: a.id,
          title: a.title,
          current_price: a.current_price,
          status: a.status,
        }))
      );
    } catch (err) {
      console.error("Failed to load my auctions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-gray-500">
            Manage your auction listings
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
        >
          + List Item
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Listings</p>
          <p className="text-2xl font-semibold mt-2">{stats.totalListings}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Active Auctions</p>
          <p className="text-2xl font-semibold mt-2">
            {stats.activeAuctions}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Pending Approval</p>
          <p className="text-2xl font-semibold mt-2">
            {stats.pendingApproval}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-semibold mt-2">${stats.totalValue}</p>
        </div>
      </div>

      {/* Table / Empty state */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Your Auction Listings</h2>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-gray-500">
            Loading...
          </div>
        ) : auctions.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500">
            <p className="mb-2 font-medium">No auctions yet</p>
            <p className="mb-4">
              Get started by listing your first item for auction.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
            >
              List Your First Item
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-sm text-gray-500">Title</th>
                <th className="px-6 py-3 text-sm text-gray-500">
                  Current Price
                </th>
                <th className="px-6 py-3 text-sm text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="px-6 py-3">{a.title}</td>
                  <td className="px-6 py-3">${a.current_price}</td>
                  <td className="px-6 py-3 capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <AuctionForm
          onClose={() => setShowForm(false)}
          onCreated={loadData}
        />
      )}
    </div>
  );
};

export default Dashboard;

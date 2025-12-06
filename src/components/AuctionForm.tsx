// src/components/AuctionForm.tsx
import React, { useState } from "react";
import api from "../api";

interface Props {
  onClose: () => void;
  onCreated: () => void; // refresh dashboard after success
}

const AuctionForm: React.FC<Props> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("0");
  const [category, setCategory] = useState("Electronics");
  const [imageUrl, setImageUrl] = useState("");
  const [auctionEnd, setAuctionEnd] = useState(""); // ISO string from datetime-local
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title,
        description,
        starting_price: parseFloat(startingPrice),
        category,
        image_url: imageUrl,
        auction_end: auctionEnd, // e.g. "2025-12-06T16:30:00"
      };

      await api.post("/auctions", payload);

      alert("Auction created successfully!");
      onCreated();
      onClose();
    } catch (err: any) {
      console.error("Failed to create auction:", err);
      const status = err?.response?.status;
      alert(`Failed to create auction (status ${status ?? "?"})`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">List New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Item Title</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starting price */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Starting Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border rounded-lg px-3 py-2"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Electronics">Electronics</option>
                <option value="Collectibles">Collectibles</option>
                <option value="Fashion">Fashion</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          {/* Auction end */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Auction End Date & Time
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded-lg px-3 py-2"
              value={auctionEnd}
              onChange={(e) => setAuctionEnd(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium"
              disabled={submitting}
            >
              {submitting ? "Listing..." : "List Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionForm;

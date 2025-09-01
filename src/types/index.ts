export interface User {
  id: string;
  email: string;
  username: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  starting_price: number;
  current_price: number;
  image_url: string;
  category: string;
  auction_end: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'ended';
  seller_id: string;
  seller_username?: string;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  bidder_username?: string;
  amount: number;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}
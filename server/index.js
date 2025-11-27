import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(403).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, role = 'customer' } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          username,
          password_hash: hashedPassword,
          role,
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create user' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Remove password from response
    const { password_hash, ...userResponse } = user;

    res.status(201).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Remove password from response
    const { password_hash, ...userResponse } = user;

    res.json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Auction routes
app.post('/api/auctions', authenticateToken, async (req, res) => {
  try {
    const { title, description, starting_price, image_url, category, auction_end } = req.body;

    const { data: auction, error } = await supabase
      .from('auction_items')
      .insert([
        {
          title,
          description,
          starting_price,
          current_price: starting_price,
          image_url,
          category,
          auction_end,
          seller_id: req.user.id,
          status: 'pending',
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create auction' });
    }

    res.status(201).json(auction);
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auctions/active', async (req, res) => {
  try {
    const { data: auctions, error } = await supabase
      .from('auction_items')
      .select(`
        *,
        users!auction_items_seller_id_fkey(username)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch auctions' });
    }

    const auctionsWithSeller = auctions.map(auction => ({
      ...auction,
      seller_username: auction.users?.username,
      users: undefined,
    }));

    res.json(auctionsWithSeller);
  } catch (error) {
    console.error('Fetch auctions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auctions/my-auctions', authenticateToken, async (req, res) => {
  try {
    const { data: auctions, error } = await supabase
      .from('auction_items')
      .select('*')
      .eq('seller_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch auctions' });
    }

    res.json(auctions);
  } catch (error) {
    console.error('Fetch user auctions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auctions/:id', authenticateToken, async (req, res) => {
  try {
    const { data: auction, error } = await supabase
      .from('auction_items')
      .select(`
        *,
        users!auction_items_seller_id_fkey(username)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const auctionWithSeller = {
      ...auction,
      seller_username: auction.users?.username,
      users: undefined,
    };

    res.json(auctionWithSeller);
  } catch (error) {
    console.error('Fetch auction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auctions/:id/bid', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const auctionId = req.params.id;

    // Get current auction
    const { data: auction, error: auctionError } = await supabase
      .from('auction_items')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    if (amount <= auction.current_price) {
      return res.status(400).json({ message: 'Bid must be higher than current price' });
    }

    if (new Date(auction.auction_end) <= new Date()) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Create bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert([
        {
          auction_id: auctionId,
          bidder_id: req.user.id,
          amount,
        }
      ])
      .select()
      .single();

    if (bidError) {
      return res.status(500).json({ message: 'Failed to place bid' });
    }

    // Update auction current price
    const { error: updateError } = await supabase
      .from('auction_items')
      .update({ current_price: amount })
      .eq('id', auctionId);

    if (updateError) {
      return res.status(500).json({ message: 'Failed to update auction price' });
    }

    res.status(201).json(bid);
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auctions/:id/bids', authenticateToken, async (req, res) => {
  try {
    const { data: bids, error } = await supabase
      .from('bids')
      .select(`
        *,
        users!bids_bidder_id_fkey(username)
      `)
      .eq('auction_id', req.params.id)
      .order('amount', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch bids' });
    }

    const bidsWithBidder = bids.map(bid => ({
      ...bid,
      bidder_username: bid.users?.username,
      users: undefined,
    }));

    res.json(bidsWithBidder);
  } catch (error) {
    console.error('Fetch bids error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin routes
app.get('/api/admin/pending-auctions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: auctions, error } = await supabase
      .from('auction_items')
      .select(`
        *,
        users!auction_items_seller_id_fkey(username)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch pending auctions' });
    }

    const auctionsWithSeller = auctions.map(auction => ({
      ...auction,
      seller_username: auction.users?.username,
      users: undefined,
    }));

    res.json(auctionsWithSeller);
  } catch (error) {
    console.error('Fetch pending auctions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/admin/all-auctions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: auctions, error } = await supabase
      .from('auction_items')
      .select(`
        *,
        users!auction_items_seller_id_fkey(username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch auctions' });
    }

    const auctionsWithSeller = auctions.map(auction => ({
      ...auction,
      seller_username: auction.users?.username,
      users: undefined,
    }));

    res.json(auctionsWithSeller);
  } catch (error) {
    console.error('Fetch all auctions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/admin/auctions/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const auctionId = req.params.id;

    const updateData = { status };
    
    // If approving, set to active
    if (status === 'approved') {
      updateData.status = 'active';
    }

    const { data: auction, error } = await supabase
      .from('auction_items')
      .update(updateData)
      .eq('id', auctionId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update auction status' });
    }

    res.json(auction);
  } catch (error) {
    console.error('Update auction status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
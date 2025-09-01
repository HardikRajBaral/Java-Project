package com.auction.service;

import com.auction.entity.Bid;
import com.auction.entity.AuctionItem;
import com.auction.entity.User;
import com.auction.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AuctionService auctionService;

    @Transactional
    public Bid placeBid(String auctionId, User bidder, BigDecimal amount) {
        AuctionItem auction = auctionService.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        // Validate auction status
        if (auction.getStatus() != AuctionItem.Status.ACTIVE) {
            throw new RuntimeException("Auction is not active");
        }

        // Check if auction has ended
        if (auction.getAuctionEnd().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Auction has ended");
        }

        // Validate bid amount
        if (amount.compareTo(auction.getCurrentPrice()) <= 0) {
            throw new RuntimeException("Bid must be higher than current price");
        }

        // Create and save bid
        Bid bid = new Bid();
        bid.setAuctionItem(auction);
        bid.setBidder(bidder);
        bid.setAmount(amount);

        Bid savedBid = bidRepository.save(bid);

        // Update auction current price
        auctionService.updateCurrentPrice(auctionId, amount);

        return savedBid;
    }

    public List<Bid> getBidHistory(String auctionId) {
        return bidRepository.findByAuctionIdOrderByAmountDesc(auctionId);
    }

    public List<Bid> getBidHistoryByAuction(AuctionItem auction) {
        return bidRepository.findByAuctionItemOrderByAmountDesc(auction);
    }
}
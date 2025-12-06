package com.auction.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auction.entity.AuctionItem;
import com.auction.entity.User;
import com.auction.repository.AuctionItemRepository;

@Service
public class AuctionService {

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    /**
     * Create a new auction.
     * For now, seller can be null (no login required).
     * New auctions are set ACTIVE so they appear immediately.
     */
    public AuctionItem createAuction(String title,
                                     String description,
                                     BigDecimal startingPrice,
                                     String imageUrl,
                                     String category,
                                     LocalDateTime auctionEnd,
                                     User seller) {

        AuctionItem auction = new AuctionItem();
        auction.setTitle(title);
        auction.setDescription(description);
        auction.setStartingPrice(startingPrice);
        auction.setCurrentPrice(startingPrice);
        auction.setImageUrl(imageUrl);
        auction.setCategory(category);
        auction.setAuctionEnd(auctionEnd);

        if (seller != null) {
            auction.setSeller(seller);
        }

        // make new auctions visible immediately
        auction.setStatus(AuctionItem.Status.ACTIVE);

        return auctionItemRepository.save(auction);
    }

    /**
     * All ACTIVE auctions (for main listing page).
     */
    public List<AuctionItem> getActiveAuctions() {
        return auctionItemRepository.findActiveAuctions();
    }

    /**
     * Auctions waiting for approval (used in AdminController).
     */
    public List<AuctionItem> getPendingAuctions() {
        return auctionItemRepository.findPendingAuctions();
    }

    /**
     * All auctions in the system.
     */
    public List<AuctionItem> getAllAuctions() {
        return auctionItemRepository.findAll();
    }

    /**
     * Auctions created by a specific user (used for "My Auctions").
     */
    public List<AuctionItem> getUserAuctions(User user) {
        return auctionItemRepository.findBySellerOrderByCreatedAtDesc(user);
    }

    /**
     * Find auction by ID.
     */
    public Optional<AuctionItem> findById(String id) {
        return auctionItemRepository.findById(id);
    }

    /**
     * Update auction status (used in AdminController).
     * If status is APPROVED, we set it to ACTIVE so it shows on the site.
     */
    public AuctionItem updateStatus(String auctionId, AuctionItem.Status status) {
        AuctionItem auction = auctionItemRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (status == AuctionItem.Status.APPROVED) {
            auction.setStatus(AuctionItem.Status.ACTIVE);
        } else {
            auction.setStatus(status);
        }

        return auctionItemRepository.save(auction);
    }

    /**
     * Update the current highest bid price (used in BidService).
     */
    public void updateCurrentPrice(String auctionId, BigDecimal newPrice) {
        AuctionItem auction = auctionItemRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        auction.setCurrentPrice(newPrice);
        auctionItemRepository.save(auction);
    }

    /**
     * Helper: check if an auction is active and not expired.
     */
    public boolean isAuctionActive(AuctionItem auction) {
        return auction.getStatus() == AuctionItem.Status.ACTIVE
                && auction.getAuctionEnd().isAfter(LocalDateTime.now());
    }
}

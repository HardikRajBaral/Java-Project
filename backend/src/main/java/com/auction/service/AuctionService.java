package com.auction.service;

import com.auction.entity.AuctionItem;
import com.auction.entity.User;
import com.auction.repository.AuctionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    public AuctionItem createAuction(String title, String description, BigDecimal startingPrice,
                                   String imageUrl, String category, LocalDateTime auctionEnd, User seller) {
        AuctionItem auction = new AuctionItem();
        auction.setTitle(title);
        auction.setDescription(description);
        auction.setStartingPrice(startingPrice);
        auction.setCurrentPrice(startingPrice);
        auction.setImageUrl(imageUrl);
        auction.setCategory(category);
        auction.setAuctionEnd(auctionEnd);
        auction.setSeller(seller);
        auction.setStatus(AuctionItem.Status.PENDING);

        return auctionItemRepository.save(auction);
    }

    public List<AuctionItem> getActiveAuctions() {
        return auctionItemRepository.findActiveAuctions();
    }

    public List<AuctionItem> getPendingAuctions() {
        return auctionItemRepository.findPendingAuctions();
    }

    public List<AuctionItem> getAllAuctions() {
        return auctionItemRepository.findAll();
    }

    public List<AuctionItem> getUserAuctions(User user) {
        return auctionItemRepository.findBySellerOrderByCreatedAtDesc(user);
    }

    public Optional<AuctionItem> findById(String id) {
        return auctionItemRepository.findById(id);
    }

    public AuctionItem updateStatus(String auctionId, AuctionItem.Status status) {
        AuctionItem auction = auctionItemRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        auction.setStatus(status);
        
        // If approving, set to active
        if (status == AuctionItem.Status.APPROVED) {
            auction.setStatus(AuctionItem.Status.ACTIVE);
        }

        return auctionItemRepository.save(auction);
    }

    public void updateCurrentPrice(String auctionId, BigDecimal newPrice) {
        AuctionItem auction = auctionItemRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        
        auction.setCurrentPrice(newPrice);
        auctionItemRepository.save(auction);
    }

    public boolean isAuctionActive(AuctionItem auction) {
        return auction.getStatus() == AuctionItem.Status.ACTIVE && 
               auction.getAuctionEnd().isAfter(LocalDateTime.now());
    }
}
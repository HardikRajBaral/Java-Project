package com.auction.repository;

import com.auction.entity.AuctionItem;
import com.auction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, String> {
    List<AuctionItem> findByStatus(AuctionItem.Status status);
    List<AuctionItem> findBySellerOrderByCreatedAtDesc(User seller);
    
    @Query("SELECT a FROM AuctionItem a WHERE a.status = 'ACTIVE' ORDER BY a.createdAt DESC")
    List<AuctionItem> findActiveAuctions();
    
    @Query("SELECT a FROM AuctionItem a WHERE a.status = 'PENDING' ORDER BY a.createdAt ASC")
    List<AuctionItem> findPendingAuctions();
}
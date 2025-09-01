package com.auction.repository;

import com.auction.entity.Bid;
import com.auction.entity.AuctionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, String> {
    List<Bid> findByAuctionItemOrderByAmountDesc(AuctionItem auctionItem);
    
    @Query("SELECT b FROM Bid b WHERE b.auctionItem.id = :auctionId ORDER BY b.amount DESC")
    List<Bid> findByAuctionIdOrderByAmountDesc(String auctionId);
}
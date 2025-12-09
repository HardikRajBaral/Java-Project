package com.example.auctionapp.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auctionapp.dto.CreateAuctionRequest;
import com.example.auctionapp.model.Auction;
import com.example.auctionapp.repository.AuctionRepository;

@RestController
@RequestMapping("/api/admin/auctions")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
public class AdminAuctionController {

    private final AuctionRepository auctionRepository;

    public AdminAuctionController(AuctionRepository auctionRepository) {
        this.auctionRepository = auctionRepository;
    }

    /**
     * Create a new auction (called only from ADMIN UI).
     */
    @PostMapping
    public ResponseEntity<Auction> createAuction(@RequestBody CreateAuctionRequest request) {

        Auction auction = new Auction();
        auction.setItemTitle(request.getTitle());
        auction.setStartingPrice(request.getStartingPrice());

        // When we create an auction, highest bid starts as startingPrice
        auction.setHighestBid(request.getStartingPrice());
        auction.setHighestBidderEmail(null);
        auction.setClosed(false);

        Auction saved = auctionRepository.save(auction);
        return ResponseEntity.ok(saved);
    }

    /**
     * Close an auction (ADMIN only in UI).
     */
    @PostMapping("/{id}/close")
    public ResponseEntity<?> closeAuction(@PathVariable Long id) {
        Auction auction = auctionRepository.findById(id).orElse(null);

        if (auction == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Auction not found."));
        }

        if (auction.isClosed()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Auction is already closed."));
        }

        auction.setClosed(true);
        Auction saved = auctionRepository.save(auction);

        // We return the updated auction so frontend can refresh that item
        return ResponseEntity.ok(saved);
    }
}

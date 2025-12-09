package com.example.auctionapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auctionapp.dto.BidRequest;
import com.example.auctionapp.model.Auction;
import com.example.auctionapp.model.Role;
import com.example.auctionapp.model.User;
import com.example.auctionapp.repository.AuctionRepository;
import com.example.auctionapp.repository.UserRepository;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
public class AuctionController {

    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    public AuctionController(AuctionRepository auctionRepository,
                             UserRepository userRepository) {
        this.auctionRepository = auctionRepository;
        this.userRepository = userRepository;
    }

    // List all auctions (user + admin)
    @GetMapping
    public List<Auction> getAuctions() {
        return auctionRepository.findAll();
    }

    // USER places a bid
    @PostMapping("/{id}/bid")
    public ResponseEntity<?> placeBid(
            @PathVariable Long id,
            @RequestBody BidRequest request
    ) {
        // 1) Check that bidder is a USER
        User bidder = userRepository.findByEmail(request.getBidderEmail())
                .orElse(null);

        if (bidder == null || bidder.getRole() != Role.USER) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Only USER role can place bids."));
        }

        // 2) Find auction
        Auction auction = auctionRepository.findById(id).orElse(null);
        if (auction == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Auction not found."));
        }

        if (auction.isClosed()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Auction is already closed."));
        }

        double amount = request.getAmount();
        double currentMin = (auction.getHighestBid() != null)
                ? auction.getHighestBid()
                : auction.getStartingPrice();

        if (amount <= currentMin) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Bid must be greater than current highest bid (" + currentMin + ")."));
        }

        // 3) Update highest bid
        auction.setHighestBid(amount);
        auction.setHighestBidderEmail(bidder.getEmail());
        Auction saved = auctionRepository.save(auction);

        return ResponseEntity.ok(saved);    
    }
}

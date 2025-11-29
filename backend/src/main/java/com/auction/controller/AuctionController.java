package com.auction.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.dto.AuctionItemRequest;
import com.auction.dto.BidRequest;
import com.auction.entity.AuctionItem;
import com.auction.entity.Bid;
import com.auction.entity.User;
import com.auction.service.AuctionService;
import com.auction.service.BidService;
import com.auction.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "*")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private BidService bidService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createAuction(@Valid @RequestBody AuctionItemRequest request,
                                           Authentication authentication) {
        try {
            User seller = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            AuctionItem auction = auctionService.createAuction(
                    request.getTitle(),
                    request.getDescription(),
                    request.getStartingPrice(),
                    request.getImageUrl(),
                    request.getCategory(),
                    request.getAuctionEnd(),
                    seller
            );

            return ResponseEntity.ok(createAuctionResponse(auction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveAuctions() {
        try {
            List<AuctionItem> auctions = auctionService.getActiveAuctions();
            List<Map<String, Object>> response = auctions.stream()
                    .map(this::createAuctionResponse)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/my-auctions")
    public ResponseEntity<?> getUserAuctions(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<AuctionItem> auctions = auctionService.getUserAuctions(user);
            List<Map<String, Object>> response = auctions.stream()
                    .map(this::createAuctionResponse)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuction(@PathVariable String id) {
        try {
            AuctionItem auction = auctionService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Auction not found"));

            return ResponseEntity.ok(createAuctionResponse(auction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/bid")
    public ResponseEntity<?> placeBid(@PathVariable String id,
                                      @Valid @RequestBody BidRequest bidRequest,
                                      Authentication authentication) {
        try {
            User bidder = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Bid bid = bidService.placeBid(id, bidder, bidRequest.getAmount());

            Map<String, Object> response = new HashMap<>();
            response.put("id", bid.getId());
            response.put("auction_id", bid.getAuctionItem().getId());
            response.put("bidder_id", bid.getBidder().getId());
            response.put("amount", bid.getAmount());
            response.put("created_at", bid.getCreatedAt().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}/bids")
    public ResponseEntity<?> getBidHistory(@PathVariable String id) {
        try {
            List<Bid> bids = bidService.getBidHistory(id);
            List<Map<String, Object>> response = bids.stream()
                    .map(this::createBidResponse)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private Map<String, Object> createAuctionResponse(AuctionItem auction) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", auction.getId());
        response.put("title", auction.getTitle());
        response.put("description", auction.getDescription());
        response.put("starting_price", auction.getStartingPrice());
        response.put("current_price", auction.getCurrentPrice());
        response.put("image_url", auction.getImageUrl());
        response.put("category", auction.getCategory());
        response.put("auction_end", auction.getAuctionEnd().toString());
        response.put("status", auction.getStatus().toString().toLowerCase());
        response.put("seller_id", auction.getSeller().getId());
        response.put("seller_username", auction.getSeller().getUsername());
        response.put("created_at", auction.getCreatedAt().toString());
        response.put("updated_at", auction.getUpdatedAt().toString());
        return response;
    }

    private Map<String, Object> createBidResponse(Bid bid) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", bid.getId());
        response.put("auction_id", bid.getAuctionItem().getId());
        response.put("bidder_id", bid.getBidder().getId());
        response.put("bidder_username", bid.getBidder().getUsername());
        response.put("amount", bid.getAmount());
        response.put("created_at", bid.getCreatedAt().toString());
        return response;
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse() {}

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
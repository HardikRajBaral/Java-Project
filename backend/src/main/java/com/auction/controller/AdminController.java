package com.auction.controller;

import com.auction.dto.StatusUpdateRequest;
import com.auction.entity.AuctionItem;
import com.auction.service.AuctionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AuctionService auctionService;

    @GetMapping("/pending-auctions")
    public ResponseEntity<List<Map<String, Object>>> getPendingAuctions() {
        List<AuctionItem> auctions = auctionService.getPendingAuctions();
        List<Map<String, Object>> response = auctions.stream()
                .map(this::createAuctionResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all-auctions")
    public ResponseEntity<List<Map<String, Object>>> getAllAuctions() {
        List<AuctionItem> auctions = auctionService.getAllAuctions();
        List<Map<String, Object>> response = auctions.stream()
                .map(this::createAuctionResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/auctions/{id}/status")
    public ResponseEntity<?> updateAuctionStatus(@PathVariable String id, 
                                                @Valid @RequestBody StatusUpdateRequest request) {
        try {
            AuctionItem auction = auctionService.updateStatus(id, request.getStatus());
            return ResponseEntity.ok(createAuctionResponse(auction));
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

    public static class ErrorResponse {
        private String message;

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
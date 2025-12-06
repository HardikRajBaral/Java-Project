package com.auction.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.dto.AuctionItemRequest;
import com.auction.entity.AuctionItem;
import com.auction.entity.User;
import com.auction.service.AuctionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "http://localhost:5173")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @PostMapping
    public ResponseEntity<?> createAuction(@Valid @RequestBody AuctionItemRequest request) {
        try {
            // no auth yet, so no seller
            User seller = null;

            AuctionItem created = auctionService.createAuction(
                    request.getTitle(),
                    request.getDescription(),
                    request.getStartingPrice(),
                    request.getImageUrl(),
                    request.getCategory(),
                    request.getAuctionEnd(),
                    seller
            );

            return ResponseEntity.ok(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error creating auction: " + e.getMessage());
        }
    }

    @GetMapping("/active")
    public List<AuctionItem> getActiveAuctions() {
        return auctionService.getActiveAuctions();
    }

    @GetMapping
    public List<AuctionItem> getAllAuctions() {
        return auctionService.getAllAuctions();
    }

    @GetMapping("/my-auctions")
    public List<AuctionItem> getMyAuctions() {
        // until real login is wired, just return empty list
        return List.of();
    }
}

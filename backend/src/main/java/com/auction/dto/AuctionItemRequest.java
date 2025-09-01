package com.auction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AuctionItemRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal startingPrice;

    @NotBlank
    private String imageUrl;

    @NotBlank
    private String category;

    @NotNull
    private LocalDateTime auctionEnd;

    // Constructors
    public AuctionItemRequest() {}

    public AuctionItemRequest(String title, String description, BigDecimal startingPrice,
                             String imageUrl, String category, LocalDateTime auctionEnd) {
        this.title = title;
        this.description = description;
        this.startingPrice = startingPrice;
        this.imageUrl = imageUrl;
        this.category = category;
        this.auctionEnd = auctionEnd;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(BigDecimal startingPrice) {
        this.startingPrice = startingPrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getAuctionEnd() {
        return auctionEnd;
    }

    public void setAuctionEnd(LocalDateTime auctionEnd) {
        this.auctionEnd = auctionEnd;
    }
}
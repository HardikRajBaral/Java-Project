package com.auction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AuctionItemRequest {

    @NotBlank
    @JsonProperty("title")
    private String title;

    @NotBlank
    @JsonProperty("description")
    private String description;

    @NotNull
    @Positive
    @JsonProperty("starting_price")
    private BigDecimal startingPrice;

    @NotBlank
    @JsonProperty("image_url")
    private String imageUrl;

    @NotBlank
    @JsonProperty("category")
    private String category;

    @NotNull
    @JsonProperty("auction_end")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")   // "2025-12-06T17:29"
    private LocalDateTime auctionEnd;

    // Getters & setters

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getStartingPrice() { return startingPrice; }
    public void setStartingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDateTime getAuctionEnd() { return auctionEnd; }
    public void setAuctionEnd(LocalDateTime auctionEnd) { this.auctionEnd = auctionEnd; }
}

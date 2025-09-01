package com.auction.dto;

import com.auction.entity.AuctionItem;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {
    @NotNull
    private AuctionItem.Status status;

    // Constructors
    public StatusUpdateRequest() {}

    public StatusUpdateRequest(AuctionItem.Status status) {
        this.status = status;
    }

    // Getters and Setters
    public AuctionItem.Status getStatus() {
        return status;
    }

    public void setStatus(AuctionItem.Status status) {
        this.status = status;
    }
}
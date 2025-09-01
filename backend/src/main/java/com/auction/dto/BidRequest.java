package com.auction.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class BidRequest {
    @NotNull
    @Positive
    private BigDecimal amount;

    // Constructors
    public BidRequest() {}

    public BidRequest(BigDecimal amount) {
        this.amount = amount;
    }

    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
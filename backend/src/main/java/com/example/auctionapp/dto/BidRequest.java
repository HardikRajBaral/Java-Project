package com.example.auctionapp.dto;

public class BidRequest {

    private double amount;
    private String bidderEmail;

    public BidRequest() {}

    public BidRequest(double amount, String bidderEmail) {
        this.amount = amount;
        this.bidderEmail = bidderEmail;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getBidderEmail() {
        return bidderEmail;
    }

    public void setBidderEmail(String bidderEmail) {
        this.bidderEmail = bidderEmail;
    }
}

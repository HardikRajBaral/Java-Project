package com.example.auctionapp.dto;

public class CreateAuctionRequest {

    private String title;
    private double startingPrice;

    public CreateAuctionRequest() {
    }

    public CreateAuctionRequest(String title, double startingPrice) {
        this.title = title;
        this.startingPrice = startingPrice;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(double startingPrice) {
        this.startingPrice = startingPrice;
    }
}

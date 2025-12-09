package com.example.auctionapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "auctions")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Item name
    private String itemTitle;

    // Fixed starting price
    private Double startingPrice;

    // Current highest bid (starts as startingPrice)
    private Double highestBid;

    // Email of user who placed the highest bid
    private String highestBidderEmail;

    // Whether auction is finished
    private boolean closed = false;

    public Auction() {
    }

    public Auction(String itemTitle, Double startingPrice) {
        this.itemTitle = itemTitle;
        this.startingPrice = startingPrice;
        this.highestBid = startingPrice;
        this.closed = false;
    }

    public Long getId() {
        return id;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public Double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(Double startingPrice) {
        this.startingPrice = startingPrice;
    }

    public Double getHighestBid() {
        return highestBid;
    }

    public void setHighestBid(Double highestBid) {
        this.highestBid = highestBid;
    }

    public String getHighestBidderEmail() {
        return highestBidderEmail;
    }

    public void setHighestBidderEmail(String highestBidderEmail) {
        this.highestBidderEmail = highestBidderEmail;
    }

    public boolean isClosed() {
        return closed;
    }

    public void setClosed(boolean closed) {
        this.closed = closed;
    }
}

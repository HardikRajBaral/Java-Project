package com.auction.dto;

import com.auction.entity.User;

public class AuthResponse {
    private String token;
    private UserDto user;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    // Inner class for user data without sensitive information
    public static class UserDto {
        private String id;
        private String email;
        private String username;
        private User.Role role;
        private String createdAt;

        public UserDto() {}

        public UserDto(User user) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.username = user.getUsername();
            this.role = user.getRole();
            this.createdAt = user.getCreatedAt().toString();
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public User.Role getRole() {
            return role;
        }

        public void setRole(User.Role role) {
            this.role = role;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }
    }
}
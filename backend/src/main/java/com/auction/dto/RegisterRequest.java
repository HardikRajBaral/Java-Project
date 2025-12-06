package com.auction.dto;

import com.auction.entity.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be 3-50 chars")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 chars")
    private String password;

    private User.Role role = User.Role.CUSTOMER;

    public RegisterRequest() {}

    public RegisterRequest(String email, String username, String password, User.Role role) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role != null ? role : User.Role.CUSTOMER;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role != null ? role : User.Role.CUSTOMER; }
}

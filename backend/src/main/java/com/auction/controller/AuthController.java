package com.auction.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.dto.AuthRequest;
import com.auction.dto.AuthResponse;
import com.auction.dto.RegisterRequest;
import com.auction.entity.User;
import com.auction.security.JwtUtil;
import com.auction.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Load user entity
            User user = userService.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(user);
            AuthResponse.UserDto userDto = new AuthResponse.UserDto(user);
            AuthResponse response = new AuthResponse(token, userDto);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); // Log full error for debugging
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        System.out.println("REGISTER API HIT: " + registerRequest.getEmail() + " / " + registerRequest.getUsername());
        try {
            // Create new user
            User user = userService.createUser(
                    registerRequest.getEmail(),
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getRole()
            );

            String token = jwtUtil.generateToken(user);
            AuthResponse.UserDto userDto = new AuthResponse.UserDto(user);
            AuthResponse response = new AuthResponse(token, userDto);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); // Print full error
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Error response class
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}

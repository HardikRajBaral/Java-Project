package com.example.auctionapp;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.auctionapp.model.Role;
import com.example.auctionapp.model.User;
import com.example.auctionapp.repository.UserRepository;

@SpringBootApplication
public class AuctionAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuctionAppApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            // create default admin only if not already present
            userRepository.findByEmail("admin@example.com")
                    .orElseGet(() -> {
                        User admin = new User();               // no-args constructor
                        admin.setEmail("admin@example.com");
                        admin.setPassword("admin123");
                        admin.setRole(Role.ADMIN);             // 👈 IMPORTANT: use enum, not String
                        return userRepository.save(admin);
                    });
        };
    }
}

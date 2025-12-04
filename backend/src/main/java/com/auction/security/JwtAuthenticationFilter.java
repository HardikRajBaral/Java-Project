package com.auction.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auction.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;          // your existing util

    @Autowired
    private UserService userService;  // implements UserDetailsService

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // 🔹 Completely skip JWT auth for:
        //    - auth endpoints (login, register, etc.)
        //    - health checks
        //    - public auctions list
        if (path.startsWith("/api/auth/")
                || path.startsWith("/api/health")
                || "/api/auctions/active".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // No token -> continue as anonymous
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        String userEmail = null;

        try {
            userEmail = jwtUtil.extractUsername(jwt); // use your JwtUtil method name
        } catch (Exception e) {
            // invalid token -> ignore and continue
            System.out.println("Invalid JWT token: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userService.loadUserByUsername(userEmail);

                if (jwtUtil.validateToken(jwt, userDetails)) { // your validate method
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            } catch (UsernameNotFoundException ex) {
                // Token refers to a user that no longer exists -> ignore token
                System.out.println("JWT for non-existing user: " + userEmail);
            } catch (Exception ex) {
                System.out.println("Error during JWT authentication: " + ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}

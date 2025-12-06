package com.auction.security;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class GenerateKey {
    public static void main(String[] args) {
        String base64 = java.util.Base64.getEncoder()
                .encodeToString(Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded());
        System.out.println(base64);
    }
}

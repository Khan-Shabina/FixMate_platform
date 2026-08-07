package com.fixmate.controller;

import com.fixmate.dto.AuthDTOs.*;
import com.fixmate.entity.Provider;
import com.fixmate.entity.User;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String dummyToken = "eyJhbGciOiJIUzI1NiJ9." + user.getEmail() + ".fixmate_token";
            JwtAuthResponse response = new JwtAuthResponse(
                dummyToken, "Bearer", user.getUserId(), user.getName(), user.getEmail(), user.getRole()
            );
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : "ROLE_CUSTOMER");

        User savedUser = userRepository.save(user);

        if ("ROLE_PROVIDER".equalsIgnoreCase(request.getRole())) {
            Provider provider = new Provider();
            provider.setUser(savedUser);
            provider.setExperience(request.getExperience() != null ? request.getExperience() : "1 Year");
            provider.setLocation(request.getLocation() != null ? request.getLocation() : "City Center");
            provider.setVerificationStatus("PENDING");
            provider.setTrustScore(85);
            provider.setIsAvailable(true);
            providerRepository.save(provider);
        }

        String dummyToken = "eyJhbGciOiJIUzI1NiJ9." + savedUser.getEmail() + ".fixmate_token";
        JwtAuthResponse response = new JwtAuthResponse(
            dummyToken, "Bearer", savedUser.getUserId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole()
        );
        return ResponseEntity.ok(response);
    }
}

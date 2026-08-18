package com.fixmate.controller;

import com.fixmate.dto.UserDTO;
import com.fixmate.entity.Provider;
import com.fixmate.entity.User;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.UserRepository;
import com.fixmate.service.TrustScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TrustScoreService trustScoreService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProviders", providerRepository.count());
        stats.put("pendingVerifications", providerRepository.findByVerificationStatus("PENDING").size());
        stats.put("totalBookings", bookingRepository.count());
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/verify-provider/{providerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Provider> verifyProvider(@PathVariable Long providerId, @RequestParam String status) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", providerId));
        
        provider.setVerificationStatus(status.toUpperCase()); // VERIFIED, REJECTED
        Provider saved = providerRepository.save(provider);
        
        // Recalculate dynamic trust score based on new verification status
        trustScoreService.calculateAndSetTrustScore(saved);
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();
        user.setRole(formattedRole);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserDTO.fromEntity(saved));
    }
}

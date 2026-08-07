package com.fixmate.controller;

import com.fixmate.entity.Provider;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProviders", providerRepository.count());
        stats.put("pendingVerifications", providerRepository.findByVerificationStatus("PENDING").size());
        stats.put("totalBookings", bookingRepository.count());
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/verify-provider/{providerId}")
    public ResponseEntity<?> verifyProvider(@PathVariable Long providerId, @RequestParam String status) {
        Optional<Provider> pOpt = providerRepository.findById(providerId);
        if (pOpt.isPresent()) {
            Provider p = pOpt.get();
            p.setVerificationStatus(status); // VERIFIED, REJECTED
            providerRepository.save(p);
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.notFound().build();
    }
}

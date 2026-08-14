package com.fixmate.service.impl;

import com.fixmate.entity.Booking;
import com.fixmate.entity.Provider;
import com.fixmate.entity.Review;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.ReviewRepository;
import com.fixmate.service.TrustScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TrustScoreServiceImpl implements TrustScoreService {

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    @Transactional
    public Integer calculateAndSetTrustScore(Provider provider) {
        if (provider == null) return 85;

        // 1. Base Score from Verification
        int baseVerificationScore = "VERIFIED".equalsIgnoreCase(provider.getVerificationStatus()) ? 80 : 50;

        // 2. Fetch Provider Bookings
        List<Booking> bookings = bookingRepository.findByProviderProviderId(provider.getProviderId());
        double completionRate = 0.85; // Default 85% completion
        double penaltyRate = 0.0;

        if (!bookings.isEmpty()) {
            long total = bookings.size();
            long completed = bookings.stream().filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus())).count();
            long cancelled = bookings.stream().filter(b -> "CANCELLED".equalsIgnoreCase(b.getStatus()) || "REJECTED".equalsIgnoreCase(b.getStatus())).count();
            
            completionRate = (double) completed / total;
            penaltyRate = (double) cancelled / total;
        }

        // 3. Fetch Provider Reviews
        List<Review> reviews = reviewRepository.findByProvider_ProviderId(provider.getProviderId());
        double avgRating = 4.8;
        if (!reviews.isEmpty()) {
            avgRating = reviews.stream().mapToInt(Review::getRating).average().orElse(4.8);
        }

        // Algorithmic Formula: (CompletionRate * 40) + (AvgRating/5.0 * 40) + (BaseVerificationScore * 0.20) - (PenaltyRate * 15)
        double calculated = (completionRate * 40.0) + ((avgRating / 5.0) * 40.0) + (baseVerificationScore * 0.20) - (penaltyRate * 15.0);

        int finalScore = (int) Math.round(calculated);
        int clampedScore = Math.max(10, Math.min(100, finalScore));

        provider.setTrustScore(clampedScore);
        providerRepository.save(provider);
        return clampedScore;
    }

    @Override
    @Transactional
    public Integer updateProviderTrustScore(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", providerId));
        return calculateAndSetTrustScore(provider);
    }
}

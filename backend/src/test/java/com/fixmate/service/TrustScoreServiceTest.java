package com.fixmate.service;

import com.fixmate.entity.Booking;
import com.fixmate.entity.Provider;
import com.fixmate.entity.Review;
import com.fixmate.entity.User;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.ReviewRepository;
import com.fixmate.service.impl.TrustScoreServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TrustScoreServiceTest {

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private TrustScoreServiceImpl trustScoreService;

    private Provider verifiedProvider;
    private Provider unverifiedProvider;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setUserId(1L);
        user.setName("Rahul Sharma");

        verifiedProvider = new Provider();
        verifiedProvider.setProviderId(10L);
        verifiedProvider.setUser(user);
        verifiedProvider.setVerificationStatus("VERIFIED");
        verifiedProvider.setTrustScore(85);

        unverifiedProvider = new Provider();
        unverifiedProvider.setProviderId(20L);
        unverifiedProvider.setUser(user);
        unverifiedProvider.setVerificationStatus("PENDING");
        unverifiedProvider.setTrustScore(85);
    }

    @Test
    @DisplayName("Calculate Trust Score - Verified provider with high ratings and 100% completion")
    void testCalculateTrustScore_VerifiedHighPerformance() {
        Booking b1 = new Booking();
        b1.setStatus("COMPLETED");
        Booking b2 = new Booking();
        b2.setStatus("COMPLETED");

        Review r1 = Review.builder().rating(5).build();
        Review r2 = Review.builder().rating(5).build();

        when(bookingRepository.findByProviderProviderId(10L)).thenReturn(List.of(b1, b2));
        when(reviewRepository.findByProvider_ProviderId(10L)).thenReturn(List.of(r1, r2));
        when(providerRepository.save(any(Provider.class))).thenAnswer(inv -> inv.getArgument(0));

        Integer score = trustScoreService.calculateAndSetTrustScore(verifiedProvider);

        // Verification = 80 * 0.20 = 16
        // Completion = (2/2) * 40 = 40
        // Rating = (5.0/5.0) * 40 = 40
        // Penalty = 0
        // Total = 16 + 40 + 40 = 96
        assertEquals(96, score);
        assertEquals(96, verifiedProvider.getTrustScore());
    }

    @Test
    @DisplayName("Calculate Trust Score - Unverified provider has lower base score")
    void testCalculateTrustScore_UnverifiedLowerBase() {
        Booking b1 = new Booking();
        b1.setStatus("COMPLETED");

        Review r1 = Review.builder().rating(5).build();

        when(bookingRepository.findByProviderProviderId(20L)).thenReturn(List.of(b1));
        when(reviewRepository.findByProvider_ProviderId(20L)).thenReturn(List.of(r1));
        when(providerRepository.save(any(Provider.class))).thenAnswer(inv -> inv.getArgument(0));

        Integer score = trustScoreService.calculateAndSetTrustScore(unverifiedProvider);

        // Base for PENDING = 50 * 0.20 = 10
        // Completion = (1/1) * 40 = 40
        // Rating = (5.0/5.0) * 40 = 40
        // Penalty = 0
        // Total = 10 + 40 + 40 = 90
        assertEquals(90, score);
    }

    @Test
    @DisplayName("Calculate Trust Score - Cancellations incur penalty reduction")
    void testCalculateTrustScore_CancellationPenalty() {
        Booking b1 = new Booking();
        b1.setStatus("COMPLETED");
        Booking b2 = new Booking();
        b2.setStatus("CANCELLED");

        Review r1 = Review.builder().rating(4).build();

        when(bookingRepository.findByProviderProviderId(10L)).thenReturn(List.of(b1, b2));
        when(reviewRepository.findByProvider_ProviderId(10L)).thenReturn(List.of(r1));
        when(providerRepository.save(any(Provider.class))).thenAnswer(inv -> inv.getArgument(0));

        Integer score = trustScoreService.calculateAndSetTrustScore(verifiedProvider);

        // Base = 16
        // Completion = 0.5 * 40 = 20
        // Rating = (4.0/5.0) * 40 = 32
        // Penalty = 0.5 * 15 = 7.5
        // Total = 16 + 20 + 32 - 7.5 = 60.5 -> 61
        assertEquals(61, score);
    }

    @Test
    @DisplayName("Update Provider Trust Score by ID - Loads from DB and updates score")
    void testUpdateProviderTrustScore_ById() {
        when(providerRepository.findById(10L)).thenReturn(Optional.of(verifiedProvider));
        when(bookingRepository.findByProviderProviderId(10L)).thenReturn(Collections.emptyList());
        when(reviewRepository.findByProvider_ProviderId(10L)).thenReturn(Collections.emptyList());
        when(providerRepository.save(any(Provider.class))).thenAnswer(inv -> inv.getArgument(0));

        Integer score = trustScoreService.updateProviderTrustScore(10L);

        assertNotNull(score);
        assertTrue(score >= 10 && score <= 100);
    }
}

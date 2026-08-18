package com.fixmate.service;

import com.fixmate.dto.ReviewDTO.ReviewRequestDTO;
import com.fixmate.dto.ReviewDTO.ReviewResponseDTO;
import com.fixmate.entity.Booking;
import com.fixmate.entity.Provider;
import com.fixmate.entity.Review;
import com.fixmate.entity.User;
import com.fixmate.exception.BadRequestException;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ReviewRepository;
import com.fixmate.service.impl.ReviewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TrustScoreService trustScoreService;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private User customer;
    private Provider provider;
    private Booking booking;

    @BeforeEach
    void setUp() {
        customer = new User();
        customer.setUserId(1L);
        customer.setName("Sumit Shelar");
        customer.setEmail("customer@fixmate.com");
        customer.setRole("ROLE_CUSTOMER");

        User providerUser = new User();
        providerUser.setUserId(2L);
        providerUser.setName("Rahul Sharma");

        provider = new Provider();
        provider.setProviderId(10L);
        provider.setUser(providerUser);
        provider.setVerificationStatus("VERIFIED");
        provider.setTrustScore(95);

        booking = new Booking();
        booking.setBookingId(100L);
        booking.setCustomer(customer);
        booking.setProvider(provider);
        booking.setStatus("COMPLETED");
    }

    @Test
    @DisplayName("Create Review - Success for completed booking and recalculates trust score")
    void testCreateReview_Success() {
        ReviewRequestDTO request = ReviewRequestDTO.builder()
                .bookingId(100L)
                .rating(5)
                .comment("Excellent emergency electrical repair work!")
                .build();

        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(reviewRepository.findByBookingBookingId(100L)).thenReturn(Optional.empty());
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> {
            Review r = inv.getArgument(0);
            r.setReviewId(501L);
            return r;
        });

        ReviewResponseDTO response = reviewService.createReview(request, "customer@fixmate.com");

        assertNotNull(response);
        assertEquals(501L, response.getReviewId());
        assertEquals(5, response.getRating());
        assertEquals(10L, response.getProviderId());
        assertEquals("Sumit Shelar", response.getCustomerName());

        verify(trustScoreService, times(1)).updateProviderTrustScore(10L);
    }

    @Test
    @DisplayName("Create Review - Rejects review if booking is not COMPLETED")
    void testCreateReview_RejectsNonCompletedBooking() {
        booking.setStatus("IN_PROGRESS");
        ReviewRequestDTO request = ReviewRequestDTO.builder()
                .bookingId(100L)
                .rating(5)
                .build();

        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            reviewService.createReview(request, "customer@fixmate.com");
        });

        assertTrue(ex.getMessage().contains("Only completed bookings can be reviewed"));
        verify(reviewRepository, never()).save(any());
        verify(trustScoreService, never()).updateProviderTrustScore(any());
    }

    @Test
    @DisplayName("Create Review - Rejects duplicate review for the same booking")
    void testCreateReview_RejectsDuplicateReview() {
        ReviewRequestDTO request = ReviewRequestDTO.builder()
                .bookingId(100L)
                .rating(5)
                .build();

        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(reviewRepository.findByBookingBookingId(100L)).thenReturn(Optional.of(new Review()));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            reviewService.createReview(request, "customer@fixmate.com");
        });

        assertTrue(ex.getMessage().contains("already been submitted"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Create Review - Rejects review from non-owner customer")
    void testCreateReview_RejectsNonOwnerCustomer() {
        ReviewRequestDTO request = ReviewRequestDTO.builder()
                .bookingId(100L)
                .rating(4)
                .build();

        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            reviewService.createReview(request, "otheruser@fixmate.com");
        });

        assertTrue(ex.getMessage().contains("only review your own bookings"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Create Review - Rejects review if booking has no assigned provider")
    void testCreateReview_RejectsNullProvider() {
        booking.setProvider(null);
        ReviewRequestDTO request = ReviewRequestDTO.builder()
                .bookingId(100L)
                .rating(4)
                .build();

        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            reviewService.createReview(request, "customer@fixmate.com");
        });

        assertTrue(ex.getMessage().contains("without an assigned provider"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Get Provider Reviews - Returns list of mapped DTOs")
    void testGetProviderReviews() {
        Review review1 = Review.builder()
                .reviewId(1L)
                .booking(booking)
                .provider(provider)
                .rating(5)
                .comment("Great job!")
                .date(LocalDateTime.now())
                .build();

        when(reviewRepository.findByProvider_ProviderId(10L)).thenReturn(List.of(review1));

        List<ReviewResponseDTO> list = reviewService.getProviderReviews(10L);

        assertEquals(1, list.size());
        assertEquals(5, list.get(0).getRating());
        assertEquals("Sumit Shelar", list.get(0).getCustomerName());
    }
}

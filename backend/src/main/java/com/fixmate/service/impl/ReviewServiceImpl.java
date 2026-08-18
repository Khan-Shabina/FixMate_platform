package com.fixmate.service.impl;

import com.fixmate.dto.ReviewDTO.ReviewRequestDTO;
import com.fixmate.dto.ReviewDTO.ReviewResponseDTO;
import com.fixmate.entity.Booking;
import com.fixmate.entity.Review;
import com.fixmate.exception.BadRequestException;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ReviewRepository;
import com.fixmate.service.ReviewService;
import com.fixmate.service.TrustScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TrustScoreService trustScoreService;

    @Override
    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO requestDTO, String authenticatedUserEmail) {
        Booking booking = bookingRepository.findById(requestDTO.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", requestDTO.getBookingId()));

        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Only completed bookings can be reviewed");
        }

        if (authenticatedUserEmail != null && booking.getCustomer() != null) {
            if (!authenticatedUserEmail.equalsIgnoreCase(booking.getCustomer().getEmail())) {
                throw new BadRequestException("You can only review your own bookings");
            }
        }

        if (reviewRepository.findByBookingBookingId(requestDTO.getBookingId()).isPresent()) {
            throw new BadRequestException("A review has already been submitted for this booking");
        }

        if (booking.getProvider() == null) {
            throw new BadRequestException("Cannot review a booking without an assigned provider");
        }

        Review review = Review.builder()
                .booking(booking)
                .provider(booking.getProvider())
                .rating(requestDTO.getRating())
                .comment(requestDTO.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        // Recalculate and persist provider trust score based on new review
        trustScoreService.updateProviderTrustScore(booking.getProvider().getProviderId());

        return ReviewResponseDTO.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getProviderReviews(Long providerId) {
        return reviewRepository.findByProvider_ProviderId(providerId).stream()
                .map(ReviewResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponseDTO getBookingReview(Long bookingId) {
        Review review = reviewRepository.findByBookingBookingId(bookingId)
                .orElse(null);
        return ReviewResponseDTO.fromEntity(review);
    }
}

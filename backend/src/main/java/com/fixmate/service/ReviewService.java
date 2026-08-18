package com.fixmate.service;

import com.fixmate.dto.ReviewDTO.ReviewRequestDTO;
import com.fixmate.dto.ReviewDTO.ReviewResponseDTO;
import java.util.List;

public interface ReviewService {
    ReviewResponseDTO createReview(ReviewRequestDTO requestDTO, String authenticatedUserEmail);
    List<ReviewResponseDTO> getProviderReviews(Long providerId);
    ReviewResponseDTO getBookingReview(Long bookingId);
}

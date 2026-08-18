package com.fixmate.dto;

import com.fixmate.entity.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

public class ReviewDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReviewRequestDTO {
        @NotNull(message = "Booking ID is required")
        private Long bookingId;

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must not exceed 5")
        private Integer rating;

        private String comment;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReviewResponseDTO {
        private Long reviewId;
        private Long bookingId;
        private Long providerId;
        private String customerName;
        private Integer rating;
        private String comment;
        private LocalDateTime date;

        public static ReviewResponseDTO fromEntity(Review review) {
            if (review == null) return null;
            String custName = null;
            if (review.getBooking() != null && review.getBooking().getCustomer() != null) {
                custName = review.getBooking().getCustomer().getName();
            }
            Long pId = review.getProvider() != null ? review.getProvider().getProviderId() : null;
            Long bId = review.getBooking() != null ? review.getBooking().getBookingId() : null;

            return ReviewResponseDTO.builder()
                    .reviewId(review.getReviewId())
                    .bookingId(bId)
                    .providerId(pId)
                    .customerName(custName != null ? custName : "Verified Customer")
                    .rating(review.getRating())
                    .comment(review.getComment())
                    .date(review.getDate())
                    .build();
        }
    }
}

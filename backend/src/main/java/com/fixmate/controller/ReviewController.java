package com.fixmate.controller;

import com.fixmate.dto.ReviewDTO.ReviewRequestDTO;
import com.fixmate.dto.ReviewDTO.ReviewResponseDTO;
import com.fixmate.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(
            @Valid @RequestBody ReviewRequestDTO requestDTO,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        ReviewResponseDTO response = reviewService.createReview(requestDTO, email);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ReviewResponseDTO>> getProviderReviews(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewService.getProviderReviews(providerId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ReviewResponseDTO> getBookingReview(@PathVariable Long bookingId) {
        ReviewResponseDTO response = reviewService.getBookingReview(bookingId);
        return ResponseEntity.ok(response);
    }
}

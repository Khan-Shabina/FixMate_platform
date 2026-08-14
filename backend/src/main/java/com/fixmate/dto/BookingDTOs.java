package com.fixmate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

public class BookingDTOs {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingRequestDTO {
        @NotNull(message = "Customer ID is required")
        private Long customerId;

        private Long providerId; // Nullable for auto-dispatch emergency bookings

        @NotNull(message = "Service ID is required")
        private Long serviceId;

        private LocalDateTime bookingDate;

        @NotBlank(message = "Address is required")
        private String address;

        private Boolean emergencyFlag = false;

        private String notes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingResponseDTO {
        private Long bookingId;
        private UserDTO customer;
        private ProviderDTO provider;
        private ServiceDTO service;
        private LocalDateTime bookingDate;
        private String status;
        private Boolean emergencyFlag;
        private String address;
    }
}

package com.fixmate.service.impl;

import com.fixmate.dto.BookingDTOs.BookingRequestDTO;
import com.fixmate.dto.BookingDTOs.BookingResponseDTO;
import com.fixmate.dto.ProviderDTO;
import com.fixmate.dto.ServiceDTO;
import com.fixmate.dto.UserDTO;
import com.fixmate.entity.Booking;
import com.fixmate.entity.Provider;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.entity.User;
import com.fixmate.exception.BadRequestException;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.ServiceRepository;
import com.fixmate.repository.UserRepository;
import com.fixmate.service.BookingService;
import com.fixmate.service.ReminderService;
import com.fixmate.service.TrustScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REJECTED"
    );

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private TrustScoreService trustScoreService;

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerUserId(customerId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getProviderBookings(Long providerId) {
        return bookingRepository.findByProviderProviderId(providerId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        return mapToResponseDTO(booking);
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO) {
        // 1. Find Customer from DB
        User customer = userRepository.findById(requestDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", requestDTO.getCustomerId()));

        // 2. Find Service from DB
        ServiceEntity service = serviceRepository.findById(requestDTO.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", requestDTO.getServiceId()));

        // 3. Find Provider or Auto-Dispatch for Emergency
        Provider provider = null;
        if (requestDTO.getProviderId() != null) {
            provider = providerRepository.findById(requestDTO.getProviderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", requestDTO.getProviderId()));
        } else if (Boolean.TRUE.equals(requestDTO.getEmergencyFlag())) {
            // Emergency Auto-Dispatch to available verified provider with highest trust score
            provider = providerRepository.findTopByVerificationStatusAndIsAvailableOrderByTrustScoreDesc("VERIFIED", true)
                    .orElseGet(() -> providerRepository.findAll().stream().findFirst().orElse(null));
        }

        if (provider == null) {
            // Fallback to first available provider if no specific provider requested
            provider = providerRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new BadRequestException("No service providers are currently available"));
        }

        // 4. Construct Booking Entity
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setProvider(provider);
        booking.setService(service);
        booking.setBookingDate(requestDTO.getBookingDate() != null ? requestDTO.getBookingDate() : LocalDateTime.now().plusHours(2));
        booking.setAddress(requestDTO.getAddress());
        booking.setEmergencyFlag(Boolean.TRUE.equals(requestDTO.getEmergencyFlag()));
        booking.setStatus("REQUESTED");

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(savedBooking);
    }

    @Override
    @Transactional
    public BookingResponseDTO updateBookingStatus(Long bookingId, String status) {
        if (status == null || !ALLOWED_STATUSES.contains(status.toUpperCase())) {
            throw new BadRequestException("Invalid booking status: '" + status + "'. Allowed statuses: " + ALLOWED_STATUSES);
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        String previousStatus = booking.getStatus();
        String newStatus = status.toUpperCase();
        booking.setStatus(newStatus);
        Booking updatedBooking = bookingRepository.save(booking);

        // If status transitioned to COMPLETED: schedule maintenance reminder & update trust score
        if ("COMPLETED".equals(newStatus) && !"COMPLETED".equalsIgnoreCase(previousStatus)) {
            reminderService.scheduleReminderForCompletedBooking(updatedBooking);
            if (updatedBooking.getProvider() != null) {
                trustScoreService.updateProviderTrustScore(updatedBooking.getProvider().getProviderId());
            }
        }

        return mapToResponseDTO(updatedBooking);
    }

    private BookingResponseDTO mapToResponseDTO(Booking b) {
        UserDTO customerDTO = b.getCustomer() != null ? UserDTO.fromEntity(b.getCustomer()) : null;
        ProviderDTO providerDTO = b.getProvider() != null ? ProviderDTO.fromEntity(b.getProvider()) : null;
        ServiceDTO serviceDTO = b.getService() != null ? ServiceDTO.fromEntity(b.getService()) : null;

        return BookingResponseDTO.builder()
                .bookingId(b.getBookingId())
                .customer(customerDTO)
                .provider(providerDTO)
                .service(serviceDTO)
                .bookingDate(b.getBookingDate())
                .status(b.getStatus())
                .emergencyFlag(b.getEmergencyFlag())
                .address(b.getAddress())
                .build();
    }
}

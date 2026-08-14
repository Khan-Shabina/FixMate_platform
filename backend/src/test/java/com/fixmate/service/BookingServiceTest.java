package com.fixmate.service;

import com.fixmate.dto.BookingDTOs.BookingRequestDTO;
import com.fixmate.dto.BookingDTOs.BookingResponseDTO;
import com.fixmate.entity.Booking;
import com.fixmate.entity.Provider;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.entity.User;
import com.fixmate.exception.BadRequestException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.ServiceRepository;
import com.fixmate.repository.UserRepository;
import com.fixmate.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private ReminderService reminderService;

    @Mock
    private TrustScoreService trustScoreService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User customer;
    private Provider provider;
    private ServiceEntity serviceEntity;

    @BeforeEach
    void setUp() {
        customer = new User();
        customer.setUserId(2L);
        customer.setName("Sujal Shelar");
        customer.setEmail("sujal@fixmate.com");
        customer.setRole("ROLE_CUSTOMER");

        User providerUser = new User();
        providerUser.setUserId(3L);
        providerUser.setName("Rahul Sharma");

        provider = new Provider();
        provider.setProviderId(1L);
        provider.setUser(providerUser);
        provider.setVerificationStatus("VERIFIED");
        provider.setTrustScore(95);
        provider.setIsAvailable(true);

        serviceEntity = new ServiceEntity();
        serviceEntity.setServiceId(10L);
        serviceEntity.setServiceName("Master Electrical Repair");
        serviceEntity.setCategory("Electrician");
        serviceEntity.setPrice(new BigDecimal("499.00"));
    }

    @Test
    @DisplayName("Create Booking - Loads actual DB entities and returns non-null customer name")
    void testCreateBooking_LoadsDBEntities() {
        BookingRequestDTO requestDTO = BookingRequestDTO.builder()
                .customerId(2L)
                .providerId(1L)
                .serviceId(10L)
                .address("Flat 402, Green Valley")
                .bookingDate(LocalDateTime.now().plusDays(1))
                .emergencyFlag(false)
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(customer));
        when(serviceRepository.findById(10L)).thenReturn(Optional.of(serviceEntity));
        when(providerRepository.findById(1L)).thenReturn(Optional.of(provider));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setBookingId(101L);
            return b;
        });

        BookingResponseDTO response = bookingService.createBooking(requestDTO);

        assertNotNull(response);
        assertEquals(101L, response.getBookingId());
        assertNotNull(response.getCustomer());
        assertEquals("Sujal Shelar", response.getCustomer().getName()); // Verify name is NOT null!
        assertEquals("Master Electrical Repair", response.getService().getServiceName());
        assertEquals("REQUESTED", response.getStatus());
    }

    @Test
    @DisplayName("Update Booking Status - Rejects invalid status values like 'ABC'")
    void testUpdateBookingStatus_RejectsInvalidStatus() {
        assertThrows(BadRequestException.class, () -> {
            bookingService.updateBookingStatus(101L, "ABC");
        });
        assertThrows(BadRequestException.class, () -> {
            bookingService.updateBookingStatus(101L, "HELLO");
        });
    }

    @Test
    @DisplayName("Update Booking Status to COMPLETED - Triggers Reminder & Trust Score update")
    void testUpdateBookingStatus_CompletedTriggersReminder() {
        Booking b = new Booking();
        b.setBookingId(101L);
        b.setCustomer(customer);
        b.setProvider(provider);
        b.setService(serviceEntity);
        b.setStatus("IN_PROGRESS");

        when(bookingRepository.findById(101L)).thenReturn(Optional.of(b));
        when(bookingRepository.save(any(Booking.class))).thenReturn(b);

        BookingResponseDTO response = bookingService.updateBookingStatus(101L, "COMPLETED");

        assertEquals("COMPLETED", response.getStatus());
        verify(reminderService, times(1)).scheduleReminderForCompletedBooking(b);
        verify(trustScoreService, times(1)).updateProviderTrustScore(1L);
    }
}

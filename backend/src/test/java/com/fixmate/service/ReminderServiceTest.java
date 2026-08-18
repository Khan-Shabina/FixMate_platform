package com.fixmate.service;

import com.fixmate.entity.Booking;
import com.fixmate.entity.MaintenanceReminder;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.entity.User;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.MaintenanceReminderRepository;
import com.fixmate.service.impl.ReminderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReminderServiceTest {

    @Mock
    private MaintenanceReminderRepository reminderRepository;

    @InjectMocks
    private ReminderServiceImpl reminderService;

    private User customer;
    private ServiceEntity acService;
    private ServiceEntity applianceService;
    private Booking acBooking;

    @BeforeEach
    void setUp() {
        customer = new User();
        customer.setUserId(1L);
        customer.setName("Sumit Shelar");

        acService = new ServiceEntity();
        acService.setServiceId(10L);
        acService.setServiceName("AC Jet Servicing");
        acService.setCategory("AC Repair");

        applianceService = new ServiceEntity();
        applianceService.setServiceId(20L);
        applianceService.setServiceName("RO Purifier Servicing");
        applianceService.setCategory("Appliance Repair");

        acBooking = new Booking();
        acBooking.setBookingId(101L);
        acBooking.setCustomer(customer);
        acBooking.setService(acService);
        acBooking.setStatus("COMPLETED");
    }

    @Test
    @DisplayName("Schedule Reminder - AC Service schedules reminder 6 months ahead")
    void testScheduleReminder_ACService() {
        when(reminderRepository.save(any(MaintenanceReminder.class))).thenAnswer(inv -> {
            MaintenanceReminder mr = inv.getArgument(0);
            mr.setReminderId(1L);
            return mr;
        });

        MaintenanceReminder result = reminderService.scheduleReminderForCompletedBooking(acBooking);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals(customer, result.getCustomer());
        assertEquals(acService, result.getService());
        assertEquals(LocalDate.now().plusMonths(6), result.getReminderDate());
    }

    @Test
    @DisplayName("Schedule Reminder - Appliance Service schedules reminder 4 months ahead")
    void testScheduleReminder_ApplianceService() {
        Booking appBooking = new Booking();
        appBooking.setCustomer(customer);
        appBooking.setService(applianceService);

        when(reminderRepository.save(any(MaintenanceReminder.class))).thenAnswer(inv -> inv.getArgument(0));

        MaintenanceReminder result = reminderService.scheduleReminderForCompletedBooking(appBooking);

        assertNotNull(result);
        assertEquals(LocalDate.now().plusMonths(4), result.getReminderDate());
    }

    @Test
    @DisplayName("Complete Reminder - Changes status to COMPLETED")
    void testCompleteReminder_Success() {
        MaintenanceReminder reminder = MaintenanceReminder.builder()
                .reminderId(5L)
                .customer(customer)
                .service(acService)
                .reminderDate(LocalDate.now().plusMonths(6))
                .status("PENDING")
                .build();

        when(reminderRepository.findById(5L)).thenReturn(Optional.of(reminder));
        when(reminderRepository.save(any(MaintenanceReminder.class))).thenAnswer(inv -> inv.getArgument(0));

        MaintenanceReminder completed = reminderService.completeReminder(5L);

        assertEquals("COMPLETED", completed.getStatus());
    }

    @Test
    @DisplayName("Get Customer Reminders - Returns list of reminders")
    void testGetCustomerReminders() {
        MaintenanceReminder reminder = MaintenanceReminder.builder()
                .reminderId(1L)
                .customer(customer)
                .service(acService)
                .reminderDate(LocalDate.now().plusMonths(6))
                .status("PENDING")
                .build();

        when(reminderRepository.findByCustomerUserId(1L)).thenReturn(List.of(reminder));

        List<MaintenanceReminder> list = reminderService.getCustomerReminders(1L);

        assertEquals(1, list.size());
        assertEquals("PENDING", list.get(0).getStatus());
    }
}

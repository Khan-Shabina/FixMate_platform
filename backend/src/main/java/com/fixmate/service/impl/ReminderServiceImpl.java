package com.fixmate.service.impl;

import com.fixmate.entity.Booking;
import com.fixmate.entity.MaintenanceReminder;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.MaintenanceReminderRepository;
import com.fixmate.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderServiceImpl implements ReminderService {

    @Autowired
    private MaintenanceReminderRepository reminderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceReminder> getCustomerReminders(Long customerId) {
        return reminderRepository.findByCustomerUserId(customerId);
    }

    @Override
    @Transactional
    public MaintenanceReminder scheduleReminderForCompletedBooking(Booking booking) {
        if (booking == null || booking.getCustomer() == null || booking.getService() == null) {
            return null;
        }

        ServiceEntity service = booking.getService();
        String category = service.getCategory() != null ? service.getCategory().toLowerCase() : "";

        int monthsToAdd = 6;
        if (category.contains("ac") || category.contains("hvac")) {
            monthsToAdd = 6;
        } else if (category.contains("appliance") || category.contains("ro") || category.contains("water")) {
            monthsToAdd = 4;
        } else if (category.contains("pest")) {
            monthsToAdd = 6;
        } else if (category.contains("clean")) {
            monthsToAdd = 3;
        }

        LocalDate reminderDate = LocalDate.now().plusMonths(monthsToAdd);

        MaintenanceReminder reminder = MaintenanceReminder.builder()
                .customer(booking.getCustomer())
                .service(booking.getService())
                .reminderDate(reminderDate)
                .status("PENDING")
                .build();

        return reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public MaintenanceReminder completeReminder(Long reminderId) {
        MaintenanceReminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance Reminder", "id", reminderId));
        reminder.setStatus("COMPLETED");
        return reminderRepository.save(reminder);
    }
}

package com.fixmate.service;

import com.fixmate.entity.Booking;
import com.fixmate.entity.MaintenanceReminder;
import java.util.List;

public interface ReminderService {
    List<MaintenanceReminder> getCustomerReminders(Long customerId);
    MaintenanceReminder scheduleReminderForCompletedBooking(Booking booking);
    MaintenanceReminder completeReminder(Long reminderId);
}

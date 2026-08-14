package com.fixmate.controller;

import com.fixmate.entity.MaintenanceReminder;
import com.fixmate.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<MaintenanceReminder>> getCustomerReminders(@PathVariable Long customerId) {
        return ResponseEntity.ok(reminderService.getCustomerReminders(customerId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<MaintenanceReminder> completeReminder(@PathVariable Long id) {
        MaintenanceReminder completed = reminderService.completeReminder(id);
        return ResponseEntity.ok(completed);
    }
}

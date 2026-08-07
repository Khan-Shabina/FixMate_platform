package com.fixmate.repository;

import com.fixmate.entity.MaintenanceReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceReminderRepository extends JpaRepository<MaintenanceReminder, Long> {
    List<MaintenanceReminder> findByCustomerUserId(Long customerId);
}

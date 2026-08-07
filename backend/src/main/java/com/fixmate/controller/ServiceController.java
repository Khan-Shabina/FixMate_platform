package com.fixmate.controller;

import com.fixmate.entity.ServiceEntity;
import com.fixmate.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getAllServices() {
        return ResponseEntity.ok(serviceRepository.findAll());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ServiceEntity>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(serviceRepository.findByCategory(category));
    }

    @PostMapping
    public ResponseEntity<ServiceEntity> addService(@RequestBody ServiceEntity service) {
        return ResponseEntity.ok(serviceRepository.save(service));
    }
}

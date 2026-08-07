package com.fixmate.controller;

import com.fixmate.entity.Provider;
import com.fixmate.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {

    @Autowired
    private ProviderRepository providerRepository;

    @GetMapping
    public ResponseEntity<List<Provider>> getAllProviders() {
        return ResponseEntity.ok(providerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProviderById(@PathVariable Long id) {
        Optional<Provider> p = providerRepository.findById(id);
        return p.isPresent() ? ResponseEntity.ok(p.get()) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestParam Boolean available) {
        Optional<Provider> pOptional = providerRepository.findById(id);
        if (pOptional.isPresent()) {
            Provider p = pOptional.get();
            p.setIsAvailable(available);
            providerRepository.save(p);
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.notFound().build();
    }
}

package com.fixmate.controller;

import com.fixmate.dto.ProviderDTO;
import com.fixmate.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @GetMapping
    public ResponseEntity<List<ProviderDTO>> getAllProviders() {
        return ResponseEntity.ok(providerService.getAllProviders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderDTO> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<ProviderDTO> updateAvailability(
            @PathVariable Long id,
            @RequestParam(required = false) Boolean available) {
        ProviderDTO updatedProvider = providerService.updateProviderAvailability(id, available);
        return ResponseEntity.ok(updatedProvider);
    }
}

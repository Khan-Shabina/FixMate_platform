package com.fixmate.service.impl;

import com.fixmate.dto.AuthDTOs.*;
import com.fixmate.entity.Provider;
import com.fixmate.entity.User;
import com.fixmate.exception.BadRequestException;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.UserRepository;
import com.fixmate.security.JwtTokenProvider;
import com.fixmate.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", loginRequest.getEmail()));

        return new JwtAuthResponse(
                token,
                "Bearer",
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
    @Transactional
    public JwtAuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address is already registered!");
        }

        String role = registerRequest.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_CUSTOMER";
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setRole(role);

        User savedUser = userRepository.save(user);

        if ("ROLE_PROVIDER".equalsIgnoreCase(role)) {
            Provider provider = new Provider();
            provider.setUser(savedUser);
            provider.setExperience(registerRequest.getExperience() != null ? registerRequest.getExperience() : "1 Year");
            provider.setLocation(registerRequest.getLocation() != null ? registerRequest.getLocation() : "City Center");
            provider.setVerificationStatus("PENDING");
            provider.setTrustScore(85);
            provider.setIsAvailable(true);
            providerRepository.save(provider);
        }

        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail());

        return new JwtAuthResponse(
                token,
                "Bearer",
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }
}

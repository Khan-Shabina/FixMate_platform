package com.fixmate.service;

import com.fixmate.dto.AuthDTOs.*;

public interface AuthService {
    JwtAuthResponse login(LoginRequest loginRequest);
    JwtAuthResponse register(RegisterRequest registerRequest);
}

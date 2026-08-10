package com.fixmate.service;

import com.fixmate.dto.UserDTO;
import java.util.List;

public interface UserService {
    UserDTO getUserById(Long userId);
    UserDTO getUserByEmail(String email);
    UserDTO getCurrentUser(String email);
    List<UserDTO> getAllUsers();
    UserDTO updateUserProfile(String email, UserDTO updateDTO);
}

import { mockServices, mockProviders, mockBookings, mockReminders, mockSocietyBookings } from '../data/mockData';

const BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  // Authentication
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, user: data };
      } else {
        return { success: false, error: data.message || 'Invalid email or password' };
      }
    } catch (e) {
      console.warn('Backend server offline, using client auth simulation');
      if (email === 'customer@fixmate.com' && password === 'password123') {
        return {
          success: true,
          user: { accessToken: 'mock_jwt_token_123', userId: 1, name: 'Sumit Shelar', email, role: 'ROLE_CUSTOMER' }
        };
      } else if (email === 'rahul.provider@fixmate.com' && password === 'password123') {
        return {
          success: true,
          user: { accessToken: 'mock_jwt_token_123', userId: 3, name: 'Rahul Sharma', email, role: 'ROLE_PROVIDER' }
        };
      } else if (email === 'admin@fixmate.com' && password === 'password123') {
        return {
          success: true,
          user: { accessToken: 'mock_jwt_token_123', userId: 6, name: 'Admin System', email, role: 'ROLE_ADMIN' }
        };
      } else if (password === 'password123') {
        return {
          success: true,
          user: {
            accessToken: 'mock_jwt_token_123',
            userId: Date.now(),
            name: email.split('@')[0],
            email,
            role: email.includes('admin') ? 'ROLE_ADMIN' : email.includes('provider') ? 'ROLE_PROVIDER' : 'ROLE_CUSTOMER'
          }
        };
      } else {
        return { success: false, error: 'Invalid email or password. Hint: Default password is password123' };
      }
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, user: data };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (e) {
      console.warn('Backend server offline, using client registration simulation');
      return {
        success: true,
        user: {
          accessToken: 'mock_jwt_token_new',
          userId: Date.now(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'ROLE_CUSTOMER'
        }
      };
    }
  },

  // Services
  getServices: async () => {
    try {
      const res = await fetch(`${BASE_URL}/services`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, returning mock services');
    }
    return mockServices;
  },

  // Providers
  getProviders: async () => {
    try {
      const res = await fetch(`${BASE_URL}/providers`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, returning mock providers');
    }
    return mockProviders;
  },

  // Bookings
  createBooking: async (bookingData) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, returning mock booking creation');
    }
    return {
      id: `FM-${Math.floor(1000 + Math.random() * 9000)}`,
      ...bookingData,
      status: 'Requested'
    };
  },

  // Maintenance Reminders
  getReminders: async () => {
    return mockReminders;
  },

  // Society Bookings
  getSocietyBookings: async () => {
    return mockSocietyBookings;
  }
};

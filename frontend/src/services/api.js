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
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend server offline, returning mock auth data');
    }
    // Fallback Mock User Login
    return {
      accessToken: 'mock_jwt_token_123',
      userId: 1,
      name: email.includes('admin') ? 'Admin System' : email.includes('provider') ? 'Rahul Sharma' : 'Sumit Shelar',
      email: email,
      role: email.includes('admin') ? 'ROLE_ADMIN' : email.includes('provider') ? 'ROLE_PROVIDER' : 'ROLE_CUSTOMER'
    };
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend server offline, returning mock registration response');
    }
    return {
      accessToken: 'mock_jwt_token_new',
      userId: Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'ROLE_CUSTOMER'
    };
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

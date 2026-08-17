const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('fixmate_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // Authentication - Login
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.accessToken) {
          localStorage.setItem('fixmate_token', data.accessToken);
        }
        return { success: true, user: data };
      } else {
        return { success: false, error: data.message || 'Invalid email or password' };
      }
    } catch (e) {
      console.warn('Backend server offline or unreachable on port 8080.');
      return { success: false, error: 'Could not connect to backend server on port 8080. Please ensure the backend is running.' };
    }
  },

  // Authentication - Register
  register: async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        if (data.accessToken) {
          localStorage.setItem('fixmate_token', data.accessToken);
        }
        return { success: true, user: data };
      } else {
        const errorMsg = data.errors ? Object.values(data.errors).join(', ') : (data.message || 'Registration failed');
        return { success: false, error: errorMsg };
      }
    } catch (e) {
      console.warn('Backend server offline or unreachable on port 8080.');
      return { success: false, error: 'Could not connect to backend server on port 8080. Please ensure the backend is running.' };
    }
  },

  // Get Current User Profile
  getCurrentUser: async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline');
    }
    return null;
  },

  // Admin Stats & Verification
  getAdminStats: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline');
    }
    return null;
  },

  verifyProvider: async (providerId, status) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/verify-provider/${providerId}?status=${status}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (res.ok) return { success: true, data: await res.json() };
    } catch (e) {
      console.warn('Backend offline');
    }
    return { success: false };
  },

  // Services
  getServices: async () => {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch services from backend');
    }
    return [];
  },

  addService: async (serviceData) => {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      let errorMsg = 'Failed to add service';
      try {
        const data = await res.json();
        if (data && data.message) errorMsg = data.message;
      } catch (err) {}
      return { success: false, error: errorMsg };
    } catch (e) {
      return { success: false, error: 'Network error while adding service' };
    }
  },

  deleteService: async (serviceId) => {
    try {
      const res = await fetch(`${BASE_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok || res.status === 204) {
        return { success: true };
      }
      let errorMsg = 'Failed to delete service';
      try {
        const data = await res.json();
        if (data && data.message) errorMsg = data.message;
      } catch (err) {}
      return { success: false, error: errorMsg };
    } catch (e) {
      return { success: false, error: 'Network error while deleting service' };
    }
  },

  // Providers
  getProviders: async () => {
    try {
      const res = await fetch(`${BASE_URL}/providers`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch providers from backend');
    }
    return [];
  },

  // Bookings
  createBooking: async (bookingData) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const data = await res.json();
      return { success: false, error: data.message || 'Failed to create booking' };
    } catch (e) {
      return { success: false, error: 'Network error while creating booking' };
    }
  },

  getCustomerBookings: async (customerId) => {
    try {
      const endpoint = customerId ? `${BASE_URL}/bookings/customer/${customerId}` : `${BASE_URL}/bookings`;
      const res = await fetch(endpoint, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch bookings from backend');
    }
    return [];
  },

  getProviderBookings: async (providerId) => {
    try {
      const endpoint = providerId ? `${BASE_URL}/bookings/provider/${providerId}` : `${BASE_URL}/bookings`;
      const res = await fetch(endpoint, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch provider bookings');
    }
    return [];
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/status?status=${status}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (res.ok) return { success: true, data: await res.json() };
      const data = await res.json();
      return { success: false, error: data.message || 'Invalid status' };
    } catch (e) {
      return { success: false, error: 'Network error while updating booking status' };
    }
  },

  // Maintenance Reminders
  getReminders: async (customerId) => {
    try {
      const endpoint = customerId ? `${BASE_URL}/reminders/customer/${customerId}` : `${BASE_URL}/reminders/customer/1`;
      const res = await fetch(endpoint, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch reminders from backend');
    }
    return [];
  },

  // Society Bookings
  getSocietyBookings: async () => {
    try {
      const res = await fetch(`${BASE_URL}/society-bookings`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch society bookings from backend');
    }
    return [];
  },

  joinSocietyBooking: async (societyBookingId, customerId) => {
    try {
      const res = await fetch(`${BASE_URL}/society-bookings/${societyBookingId}/join?customerId=${customerId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) return { success: true, data: await res.json() };
    } catch (e) {
      console.warn('Failed to join society booking');
    }
    return { success: false };
  }
};

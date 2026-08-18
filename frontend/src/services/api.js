const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = (isJson = true) => {
  const token = localStorage.getItem('fixmate_token');
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (res.status === 204) {
    return { success: true, data: null };
  }

  let data = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (res.ok) {
    return { success: true, data };
  }

  if (res.status === 401) {
    return {
      success: false,
      status: 401,
      error: data?.message || 'Authentication required. Please sign in.'
    };
  }

  if (res.status === 403) {
    return {
      success: false,
      status: 403,
      error: data?.message || 'Access denied. You do not have permission.'
    };
  }

  const errorMsg = data?.errors
    ? Object.values(data.errors).join(', ')
    : data?.message || `Request failed with status ${res.status}`;

  return { success: false, status: res.status, error: errorMsg, data };
};

export const apiService = {
  // ================= AUTHENTICATION =================
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await handleResponse(res);
      if (result.success && result.data?.accessToken) {
        localStorage.setItem('fixmate_token', result.data.accessToken);
        return { success: true, user: result.data };
      }
      return { success: false, error: result.error || 'Invalid credentials' };
    } catch (err) {
      return { success: false, error: 'Could not connect to backend server. Please verify the API is running.' };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await handleResponse(res);
      if (result.success && result.data?.accessToken) {
        localStorage.setItem('fixmate_token', result.data.accessToken);
        return { success: true, user: result.data };
      }
      return { success: false, error: result.error || 'Registration failed' };
    } catch (err) {
      return { success: false, error: 'Could not connect to backend server. Please verify the API is running.' };
    }
  },

  getCurrentUser: async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  },

  updateUserProfile: async (updateData) => {
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while updating profile' };
    }
  },

  // ================= SERVICES =================
  getServices: async () => {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        headers: getAuthHeaders(false)
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  getServiceById: async (serviceId) => {
    try {
      const res = await fetch(`${BASE_URL}/services/${serviceId}`, {
        headers: getAuthHeaders(false)
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Failed to fetch service' };
    }
  },

  getServicesByCategory: async (category) => {
    try {
      const res = await fetch(`${BASE_URL}/services/category/${encodeURIComponent(category)}`, {
        headers: getAuthHeaders(false)
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  addService: async (serviceData) => {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData)
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while adding service' };
    }
  },

  deleteService: async (serviceId) => {
    try {
      const res = await fetch(`${BASE_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(false)
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while deleting service' };
    }
  },

  // ================= PROVIDERS =================
  getProviders: async () => {
    try {
      const res = await fetch(`${BASE_URL}/providers`, {
        headers: getAuthHeaders(false)
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  getProviderById: async (providerId) => {
    try {
      const res = await fetch(`${BASE_URL}/providers/${providerId}`, {
        headers: getAuthHeaders(false)
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Failed to fetch provider details' };
    }
  },

  getProviderByUserId: async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/providers/user/${userId}`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Failed to fetch provider profile' };
    }
  },

  updateProviderAvailability: async (providerId, available) => {
    try {
      const res = await fetch(`${BASE_URL}/providers/${providerId}/availability?available=${available}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while updating provider availability' };
    }
  },

  // ================= BOOKINGS =================
  createBooking: async (bookingData) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while creating booking' };
    }
  },

  getCustomerBookings: async (customerId) => {
    try {
      if (!customerId) return [];
      const res = await fetch(`${BASE_URL}/bookings/customer/${customerId}`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  getProviderBookings: async (providerId) => {
    try {
      if (!providerId) return [];
      const res = await fetch(`${BASE_URL}/bookings/provider/${providerId}`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  getAllBookings: async () => {
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Failed to fetch booking details' };
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/status?status=${encodeURIComponent(status)}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while updating booking status' };
    }
  },

  // ================= MAINTENANCE REMINDERS =================
  getReminders: async (customerId) => {
    try {
      if (!customerId) return [];
      const res = await fetch(`${BASE_URL}/reminders/customer/${customerId}`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  completeReminder: async (reminderId) => {
    try {
      const res = await fetch(`${BASE_URL}/reminders/${reminderId}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while completing reminder' };
    }
  },

  // ================= SOCIETY BOOKINGS =================
  getSocietyBookings: async () => {
    try {
      const res = await fetch(`${BASE_URL}/society-bookings`, {
        headers: getAuthHeaders(false)
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  getCustomerSocietyBookings: async (customerId) => {
    try {
      if (!customerId) return [];
      const res = await fetch(`${BASE_URL}/society-bookings/customer/${customerId}`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  createSocietyBooking: async ({ customerId, serviceId, societyName, bookingDate }) => {
    try {
      const params = new URLSearchParams({
        customerId,
        serviceId,
        societyName: societyName || 'Green Valley Society',
        bookingDate: bookingDate || ''
      });
      const res = await fetch(`${BASE_URL}/society-bookings?${params.toString()}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while creating society group' };
    }
  },

  joinSocietyBooking: async (societyBookingId, customerId) => {
    try {
      const res = await fetch(`${BASE_URL}/society-bookings/${societyBookingId}/join?customerId=${customerId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while joining society group' };
    }
  },

  // ================= REVIEWS =================
  submitReview: async ({ bookingId, rating, comment }) => {
    try {
      const res = await fetch(`${BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookingId, rating, comment })
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while submitting review' };
    }
  },

  getProviderReviews: async (providerId) => {
    try {
      if (!providerId) return [];
      const res = await fetch(`${BASE_URL}/reviews/provider/${providerId}`, {
        headers: getAuthHeaders(false)
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  getBookingReview: async (bookingId) => {
    try {
      if (!bookingId) return null;
      const res = await fetch(`${BASE_URL}/reviews/booking/${bookingId}`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  },

  // ================= ADMIN =================
  getAdminStats: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  },

  getAllUsers: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: getAuthHeaders()
      });
      const result = await handleResponse(res);
      return result.success && Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}/role?role=${encodeURIComponent(role)}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while updating user role' };
    }
  },

  verifyProvider: async (providerId, status) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/verify-provider/${providerId}?status=${encodeURIComponent(status)}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch {
      return { success: false, error: 'Network error while verifying provider' };
    }
  }
};

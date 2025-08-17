import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get fresh Firebase ID token
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting Firebase ID token:', error);
        // Remove any stale token from localStorage
        localStorage.removeItem('authToken');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      // Don't redirect automatically, let the component handle it
      console.error('Authentication error:', error.response?.data?.error || 'Unauthorized');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const userAPI = {
  // Create or update user profile
  createOrUpdateUser: (userData) => api.post('/api/users', userData),

  // Get user by Firebase UID
  getUserByUid: (firebaseUid) => api.get(`/api/users/${firebaseUid}`),

  // Update user profile (protected)
  updateUser: (firebaseUid, userData) => api.put(`/api/users/${firebaseUid}`, userData),

  // Get all users (admin only)
  getAllUsers: (params = {}) => api.get('/api/users', { params }),

  // Update user role (admin only)
  updateUserRole: (firebaseUid, role) => api.patch(`/api/users/${firebaseUid}/role`, { role }),

  // Delete user (admin only)
  deleteUser: (firebaseUid) => api.delete(`/api/users/${firebaseUid}`),

  // Get user statistics (admin only)
  getUserStats: () => api.get('/api/users/stats/overview'),
};

// Courts API (to be implemented)
export const courtsAPI = {
  getAllCourts: () => api.get('/api/courts'),
  getCourtById: (id) => api.get(`/api/courts/${id}`),
  createCourt: (courtData) => api.post('/api/courts', courtData),
  updateCourt: (id, courtData) => api.put(`/api/courts/${id}`, courtData),
  deleteCourt: (id) => api.delete(`/api/courts/${id}`),
};

// Bookings API (to be implemented)
export const bookingsAPI = {
  getAllBookings: (params = {}) => api.get('/api/bookings', { params }),
  getBookingById: (id) => api.get(`/api/bookings/${id}`),
  createBooking: (bookingData) => api.post('/api/bookings', bookingData),
  updateBooking: (id, bookingData) => api.put(`/api/bookings/${id}`, bookingData),
  deleteBooking: (id) => api.delete(`/api/bookings/${id}`),
  approveBooking: (id) => api.patch(`/api/bookings/${id}/approve`),
  rejectBooking: (id) => api.patch(`/api/bookings/${id}/reject`),
};

// Announcements API (to be implemented)
export const announcementsAPI = {
  getAllAnnouncements: () => api.get('/api/announcements'),
  createAnnouncement: (data) => api.post('/api/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/api/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/api/announcements/${id}`),
};

// Payments API (to be implemented)
export const paymentsAPI = {
  createPaymentIntent: (amount, currency = 'usd') =>
    api.post('/api/payments/create-intent', { amount, currency }),
  confirmPayment: (paymentData) => api.post('/api/payments/confirm', paymentData),
  // Current user's payment history (member or admin only)
  getPaymentHistory: (params = {}) => api.get('/api/payments/history', { params }),
  // Admin: all payments overview
  getAdminPayments: (params = {}) => api.get('/api/payments/admin', { params }),
};

// Coupons API (to be implemented)
export const couponsAPI = {
  getAllCoupons: () => api.get('/api/coupons'),
  validateCoupon: (code) => api.post('/api/coupons/validate', { code }),
  createCoupon: (couponData) => api.post('/api/coupons', couponData),
  updateCoupon: (id, couponData) => api.patch(`/api/coupons/${id}`, couponData),
  deleteCoupon: (id) => api.delete(`/api/coupons/${id}`),
};

export default api;
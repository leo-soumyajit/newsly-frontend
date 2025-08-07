export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/v1/auth/signup`,
  },
  OTP: {
    SEND: `${API_BASE_URL}/api/v1/otp/send-otp`,
    VERIFY: `${API_BASE_URL}/api/v1/otp/verify-otp`,
  },
};
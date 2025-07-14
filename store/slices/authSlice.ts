import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  phoneNumber: string;
  countryCode: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  otpSent: boolean;
  otpVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  otpSent: false,
  otpVerified: false,
};

// Check if user data exists in localStorage
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    initialState.user = JSON.parse(storedUser);
    initialState.isAuthenticated = true;
    initialState.otpVerified = true;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    requestOtp: (state, action: PayloadAction<{ phoneNumber: string; countryCode: string }>) => {
      state.otpSent = true;
      state.user = {
        phoneNumber: action.payload.phoneNumber,
        countryCode: action.payload.countryCode,
      };
    },
    verifyOtp: (state) => {
      state.otpVerified = true;
      state.isAuthenticated = true;
      
      // Save to localStorage
      if (typeof window !== 'undefined' && state.user) {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
      
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    },
  },
});

export const { requestOtp, verifyOtp, logout, resetOtpState } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  darkMode: boolean;
  searchQuery: string;
}

// Check if dark mode preference exists in localStorage
const loadDarkModePreference = (): boolean => {
  if (typeof window !== 'undefined') {
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference !== null) {
      return storedPreference === 'true';
    }
    
    // If no stored preference, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
  }
  return false;
};

const initialState: UiState = {
  darkMode: loadDarkModePreference(),
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', state.darkMode.toString());
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', state.darkMode.toString());
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
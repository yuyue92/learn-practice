import { create } from "zustand";

const useAuthStore = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  
  login: (userData) => {
    set({
      currentUser: userData,
      isAuthenticated: true
    });
    localStorage.setItem('auth', JSON.stringify(userData));
  },
  
  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false
    });
    localStorage.removeItem('auth');
  },
  
  initialize: () => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      console.log('====initialize====')
      set({
        currentUser: JSON.parse(savedAuth),
        isAuthenticated: true
      });
    }
  }
}));
export default useAuthStore;
import { create } from "zustand";

export const useAuthStore = create(set => ({
    user: null,
    login: (username, role) => set({ user: {
        uname: username,
        urole: role
    } }),
    logout: () => set({ user: null })
}))
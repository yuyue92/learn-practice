import { defineStore } from 'pinia'

interface AppState {
  sidebarOpened: boolean,
  passwordLevel: number,
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarOpened: true,
    passwordLevel: 0,
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened
    },
    setPassword(passNum: number) {
      this.passwordLevel = passNum;
    },
  }
})
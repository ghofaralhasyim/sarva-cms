import { defineStore } from "pinia";
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    isTokenExpired: false,
    intervalId: null as number | null,
  }),

  actions: {
    startTokenWatcher(): void {
      if (!this.token) {
        this.isTokenExpired = true;
        return;
      }

      this.intervalId = window.setInterval(() => {
        this.checkTokenExpiration();
      }, 1000);
    },

    stopTokenWatcher(): void {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    checkTokenExpiration(): void {
      if (!this.token) {
        this.isTokenExpired = true;
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(this.token);
    
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {
          this.isTokenExpired = true;
          this.logout(); 
        }
      } catch (error) {
        this.isTokenExpired = true;
        this.logout();
      }
    },

    logout(): void {
      this.token = null;
      this.stopTokenWatcher();
      const router = useRouter(); 
      router.replace('/');
    },

    initStore(): void {
      if (this.token) {
        this.startTokenWatcher();
      }
    },
  },

  persist: true,
});

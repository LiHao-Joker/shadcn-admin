import {create} from "zustand/react";
import {immer} from "zustand/middleware/immer";
import {persist} from "zustand/middleware";
import {devtools} from "zustand/middleware";

interface AuthState {
  userId: string;
  accessToken: string;
  accessTokenExpiry: string;
  refreshToken: string;
  refreshTokenValidityMinutes: number;
  login: (credentials: {
    userId: string;
    accessToken: string;
    accessTokenExpiry: string;
    refreshToken: string;
    refreshTokenValidityMinutes: number;
  }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isRefreshTokenValid: () => boolean;
  refreshTokens: (tokens: {
    accessToken: string;
    accessTokenExpiry: string;
  }) => void;
}


export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        userId: "",
        accessToken: "",
        accessTokenExpiry: "",
        refreshToken: "",
        refreshTokenValidityMinutes: 0,

        login: ({userId, accessToken, accessTokenExpiry, refreshToken, refreshTokenValidityMinutes}) =>
          set((state) => {
            state.userId = userId;
            state.accessToken = accessToken;
            state.accessTokenExpiry = accessTokenExpiry;
            state.refreshToken = refreshToken;
            state.refreshTokenValidityMinutes = refreshTokenValidityMinutes;
          }, false, 'auth/login'),

        logout: () =>
          set((state) => {
            state.userId = "";
            state.accessToken = "";
            state.accessTokenExpiry = "";
            state.refreshToken = "";
            state.refreshTokenValidityMinutes = 0;
          }, false, 'auth/logout'),

        isAuthenticated: () => {
          const now = new Date();
          const accessTokenCreationTime = new Date(get().accessTokenExpiry);
          return (
            get().accessToken !== "" &&
            accessTokenCreationTime > now
          );
        },

        isRefreshTokenValid: () => {
          if (!get().refreshToken) return false;

          // 计算refreshToken的过期时间点
          const refreshTokenCreationTime = new Date(get().accessTokenExpiry);
          refreshTokenCreationTime.setMinutes(
            refreshTokenCreationTime.getMinutes() - new Date(get().accessTokenExpiry).getMinutes()
          );

          const refreshTokenExpiry = new Date(refreshTokenCreationTime);
          refreshTokenExpiry.setMinutes(
            refreshTokenExpiry.getMinutes() + get().refreshTokenValidityMinutes
          );

          return new Date() < refreshTokenExpiry;
        },
        refreshTokens: ({accessToken, accessTokenExpiry}) =>
          set((state) => {
            state.accessToken = accessToken;
            state.accessTokenExpiry = accessTokenExpiry
          }, false, 'auth/refreshTokens'),
      })),
      {
        name: "auth-storage",
        partialize: (state) => ({
          userId: state.userId,
          accessToken: state.accessToken,
          accessTokenExpiry: state.accessTokenExpiry,
          refreshToken: state.refreshToken,
          refreshTokenValidityMinutes: state.refreshTokenValidityMinutes,
        }),
      }
    ),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);

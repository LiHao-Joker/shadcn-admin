import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const TOKEN = 'thisisjustarandomstring'

interface AuthUser {
  id: string
  name: string
  avatar: string
  email: string
  roles: string[]
}

interface AuthToken {
  accessToken: string
  refreshToken: string
  accessTokenExpiry: Date
  refreshTokenValidityMinutes: number
  userId: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    token: AuthToken | null
    setUser: (user: AuthUser | null) => void
    setToken: (token: AuthToken | null) => void
    resetToken: () => void
    reset: () => void
    isAuthenticated: () => boolean
  }
}

export const useAuthStore = create<AuthState>()(
  immer((set, get) => {
    const cookieState = getCookie(TOKEN) ?? null
    const initToken = cookieState ? JSON.parse(cookieState) : ''
    return {
      auth: {
        user: null,
        setUser: (user) =>
          set((state) => {
            state.auth.user = user
          }),
        token: initToken,
        setToken: (token) => {
          set((state) => {
            setCookie(TOKEN, JSON.stringify(token))
            state.auth.token = token
          })
        },
        resetToken: () => {
          set((state) => {
            removeCookie(TOKEN)
            state.auth.token = null
          })
        },
        reset: () => {
          set((state) => {
            removeCookie(TOKEN)
            state.auth.user = null
            state.auth.token = null
          })
        },
        isAuthenticated: () => {
          return !!get().auth.token?.accessToken?.trim()
        },
      },
    }
  })
)

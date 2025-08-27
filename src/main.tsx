import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError, type AxiosResponse } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { handleServerError } from '@/lib/handle-server-error'
import { client } from './api/client.gen'
import { DirectionProvider } from './context/direction-provider'
import { FontProvider } from './context/font-provider'
import { ThemeProvider } from './context/theme-provider'
// Generated Routes
import { routeTree } from './routeTree.gen'
// Styles
import './styles/index.css'

client.instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.token?.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// 状态锁：防止并发401错误导致的多次刷新令牌
let isRefreshing = false

client.instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response } = error
    if (response) {
      const { status, config } = response

      if (status === 401 && !config.url?.includes('/refresh-token')) {
        // 如果正在刷新令牌，则等待完成后直接重试
        if (isRefreshing) {
          // 简单等待后重试，避免立即重试仍未获取到新令牌
          await new Promise((resolve) => setTimeout(resolve, 500))
          return client.instance(config)
        }
        // 标记正在刷新令牌
        isRefreshing = true
        try {
          const res = await refreshToken()
          if (res.status == 200) {
            return await client.instance(config)
          }
        } finally {
          // 无论刷新成功与否，都释放锁
          isRefreshing = false
        }
      }
    }
    return Promise.reject(error)
  }
)

async function refreshToken() {
  const res = await client.post({
    url: '/api/auth/refresh-token',
    body: {
      userId: useAuthStore.getState().auth.token?.userId,
      refreshToken: useAuthStore.getState().auth.token?.refreshToken,
    },
  })

  const data = res.data as {
    userId: string
    accessToken: string
    accessTokenExpiry: Date
    refreshToken: string
    refreshTokenValidityMinutes: number
  }

  useAuthStore.getState().auth.setToken({
    ...data,
  })
  return res
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!')
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Session expired!')
          useAuthStore.getState().auth.reset()
          const redirect = `${router.history.location.href}`
          router.navigate({ to: '/sign-in', search: { redirect } })
        }
        if (error.response?.status === 500) {
          toast.error('Internal Server Error!')
          router.navigate({ to: '/500' })
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontProvider>
            <DirectionProvider>
              <RouterProvider router={router} />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

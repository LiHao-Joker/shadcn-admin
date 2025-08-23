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

// 存储刷新状态和等待的请求队列
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: AxiosError) => void
}> = []

// 处理队列中的请求重试
const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    } else {
      prom.reject({
        ...new Error('Token refresh failed with no error'),
        isAxiosError: true,
        toJSON: () => ({ message: 'Token refresh failed with no error' }),
      } as AxiosError)
    }
  })
  failedQueue = []
}

client.instance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  async (config) => {
    const authStore = useAuthStore.getState()
    const { token } = authStore.auth
    // 如果没有令牌，直接返回配置
    if (!token) return config

    // 检查访问令牌是否过期
    const isExpired = token.accessTokenExpiry <= new Date()

    // 令牌未过期，直接添加到请求头
    if (!isExpired) {
      config.headers.Authorization = `Bearer ${token.accessToken}`
      return config
    }

    if (isExpired) {
      // 如果正在刷新中，将当前请求加入队列等待
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`
            return config
          })
          .catch((err) => Promise.reject(err))
      }
      // 标记为正在刷新
      isRefreshing = true

      try {
        // 刷新令牌
        const newAccessToken = await refreshToken()
        // 处理等待队列
        processQueue(null, token.accessToken)

        // 使用新令牌继续当前请求
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        }
      } catch (error) {
        // 刷新失败处理
        processQueue(error as AxiosError)
        authStore.auth.resetToken() // 清除无效令牌
        throw error
      } finally {
        isRefreshing = false
      }
    }
  },
  (error: AxiosError) => Promise.reject(error)
)

client.instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
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

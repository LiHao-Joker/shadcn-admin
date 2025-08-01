import axios, { AxiosError, type AxiosResponse } from 'axios'
import qs from 'qs'
import { useAuthStore } from '@/stores/authStore.ts'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_API,
  timeout: import.meta.env.VITE_API_TIME_OUT,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
})

request.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

request.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response } = error
    if (response) {
      const { status, config } = response

      if (status === 401 && !config.url?.includes('/refresh-token')) {
        const res = await refreshToken()
        if (res.status == 200) {
          return await request(config)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default request

async function refreshToken() {
  const res = await axios.post('refresh-token', {
    params: {
      id: useAuthStore.getState().userId,
      refreshToken: useAuthStore.getState().refreshToken,
    },
  })

  useAuthStore.getState().login({
    userId: res.data.userId,
    accessToken: res.data.accessToken,
    accessTokenExpiry: res.data.accessTokenExpiry,
    refreshToken: res.data.refreshToken,
    refreshTokenValidityMinutes: res.data.refreshTokenValidityMinutes,
  })

  return res
}

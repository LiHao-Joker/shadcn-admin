import { type CreateClientConfig } from '@/api/client.gen.ts'

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseURL: import.meta.env.VITE_API_BASE_API,
  timeout: import.meta.env.VITE_API_TIME_OUT,
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams()
    // 遍历参数并添加到 URLSearchParams
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // 数组处理：默认会以 key=value1&key=value2 形式序列化
        value.forEach((v) => searchParams.append(key, String(v)))
      } else if (value !== undefined && value !== null) {
        // 非数组值直接添加
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  },
})

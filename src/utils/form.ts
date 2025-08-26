import { type AxiosError } from 'axios'
import {
  type FieldValues,
  type UseFormSetError,
  type Path,
} from 'react-hook-form'
import { type ProblemDetails } from '@/api'

/**
 * 处理表单验证错误（400状态码）
 * 将后端返回的错误信息映射到表单字段
 * @param error AxiosError对象，包含后端返回的错误信息
 * @param setError react-hook-form的setError方法
 */
export function handleFormValidationErrors<TSchema extends FieldValues>(
  error: AxiosError<ProblemDetails>,
  setError: UseFormSetError<TSchema>
) {
  const { data, status } = error.response || {}

  // 只处理400 Bad Request的验证错误
  if (status === 400 && data?.errors) {
    data.errors.forEach((err) => {
      // 将错误字段名断言为符合Path<TSchema>类型的路径
      const fieldPath = err.name as Path<TSchema>
      setError(fieldPath, {
        type: 'manual',
        message: err.reason || '验证失败',
      })
    })
  }
}

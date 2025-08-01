// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 此处后端没有提供注释 GET /api/auth/profile */
export async function getProfileEndpoint(
  options ?: {[key: string]: any}
) {
  return request<API.GetProfileResponse>('/api/auth/profile', {
  method: 'GET',
    ...(options || {}),
  });
}

/** 刷新 Token POST /api/auth/refresh-token */
export async function userTokenService(body: API.TokenRequest,
  options ?: {[key: string]: any}
) {
  return request<API.RefreshTokenResponse>('/api/auth/refresh-token', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/auth/sign-in */
export async function signInEndpoint(body: API.SignInRequest,
  options ?: {[key: string]: any}
) {
  return request<API.RefreshTokenResponse>('/api/auth/sign-in', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/auth/sign-up */
export async function signUpEndpoint(body: API.SignUpRequest,
  options ?: {[key: string]: any}
) {
  return request<any>('/api/auth/sign-up', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


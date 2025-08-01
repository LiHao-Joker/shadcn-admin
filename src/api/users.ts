// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 此处后端没有提供注释 GET /api/users */
export async function queryPageEndpoint(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryPageEndpointParams
    ,
  options ?: {[key: string]: any}
) {
  return request<API.QueryPageResponse>('/api/users', {
  method: 'GET',
    params: {
        
        
        
        ...params,},
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/users */
export async function updateUserEndpoint(body: API.UpdateUserRequest,
  options ?: {[key: string]: any}
) {
  return request<any>('/api/users', {
  method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/users */
export async function createUserEndpoint(body: API.CreateUserRequest,
  options ?: {[key: string]: any}
) {
  return request<any>('/api/users', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/users/${param0} */
export async function queryUserByIdEndpoint(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryUserByIdEndpointParams
    ,
  options ?: {[key: string]: any}
) {
  const { 'id': param0, 
  ...queryParams
  } = params;
  return request<API.QueryUserByIdResponse>(`/api/users/${param0}`, {
  method: 'GET',
    params: {...queryParams,},
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/users/${param0} */
export async function deleteUserEndpoint(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DeleteUserEndpointParams
    ,
  options ?: {[key: string]: any}
) {
  const { 'id': param0, 
  ...queryParams
  } = params;
  return request<any>(`/api/users/${param0}`, {
  method: 'DELETE',
    params: {...queryParams,},
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /api/users/${param0} */
export async function lockUserEndpoint(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.LockUserEndpointParams
    ,body: API.LockUserRequest,
  options ?: {[key: string]: any}
) {
  const { 'id': param0, 
  ...queryParams
  } = params;
  return request<any>(`/api/users/${param0}`, {
  method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {...queryParams,},
    data: body,
    ...(options || {}),
  });
}


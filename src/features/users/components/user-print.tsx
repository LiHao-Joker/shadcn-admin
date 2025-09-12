import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUserByIdEndpoint, type UserDto } from '@/api'

type UserPrintProps = {
  currentRow?: UserDto
  ref?: React.Ref<HTMLDivElement>
}

function UserPrint({ currentRow, ref }: UserPrintProps) {
  const { data: user } = useQuery({
    queryKey: ['user', currentRow?.id ?? ''],
    queryFn: async () => {
      const res = await getUserByIdEndpoint({
        path: {
          id: currentRow?.id ?? '',
        },
      })
      return res.data
    },
  })

  return (
    <div
      ref={ref}
      className='overflow-hidden rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-md'
    >
      {/* 用户头部信息 */}
      <div className='flex items-center gap-4 border-b bg-gray-50 p-4'>
        {/* 头像 */}
        <div className='relative h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-sm'>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.userName}的头像`}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gray-200 text-gray-500'>
              <span className='text-xl font-bold'>
                {user?.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* 基本信息 */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>
            {user?.userName}
          </h3>
          <p className='text-sm text-gray-500'>{user?.email}</p>
        </div>

        {/* 状态指示器 */}
        <div className='ml-auto flex items-center gap-1.5'>
          <span
            className={`h-2.5 w-2.5 rounded-full ${user?.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
          ></span>
          <span className='text-xs font-medium text-gray-600'>
            {user?.isActive ? '活跃' : '非活跃'}
          </span>
        </div>
      </div>

      {/* 用户详细信息 */}
      <div className='p-4'>
        <div className='mb-3'>
          <p className='mb-1 text-xs text-gray-500'>用户ID</p>
          <p className='rounded bg-gray-50 px-2 py-1 font-mono text-sm text-gray-700'>
            {user?.id}
          </p>
        </div>

        <div>
          <p className='mb-1 text-xs text-gray-500'>角色</p>
          <div className='flex flex-wrap gap-2'>
            {user?.roles.map((role, index) => (
              <span
                key={index}
                className='rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700'
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPrint

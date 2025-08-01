import { z } from 'zod'

const userStatusSchema = z.union([z.literal('Locked'), z.literal('CanUse')])
export type UserStatus = z.infer<typeof userStatusSchema>

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  userName: z.string(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  status: userStatusSchema,
  creationTime: z.string(),
  lastModificationTime: z.string().optional(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)

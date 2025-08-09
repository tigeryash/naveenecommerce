import type { Access } from 'payload/'
import type { User } from '@/payload-types'

export const selfOrAdmin: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (user.role?.includes('admin')) {
    return true
  }

  return {
    id: {
      equals: user.id,
    },
  }
}

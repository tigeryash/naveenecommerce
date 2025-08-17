import type { FieldHook } from 'payload'
import type { User } from '@/payload-types'

export const protectRoles: FieldHook<{ id: string } & User> = ({ req: { user }, data }) => {
  const isAdmin = user?.role?.includes('admin')

  if (!isAdmin) {
    return ['customer']
  }

  const userRoles = new Set(data?.role || [])
  userRoles.add('customer')
  return [...userRoles.values()]
}

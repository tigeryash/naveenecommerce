import type { FieldHook } from 'payload'
import type { User } from '@/payload-types'

export const protectRoles: FieldHook<User> = async ({ req, data, operation }) => {
  if (operation === 'create') {
    try {
      const { totalDocs } = await req.payload.find({
        collection: 'users',
        limit: 0,
        depth: 0,
      })

      if (totalDocs === 0) {
        if (data?.role?.includes('admin')) {
          const userRoles = new Set(data.role)
          userRoles.add('customer')
          return [...userRoles.values()]
        }
        return ['customer']
      }
    } catch (error) {
      req.payload.logger.error(`Error checking for first user in protectRoles hook: ${error}`)
      // Fallback to safety
      return ['customer']
    }
  }

  const loggedInUser = req.user as User | undefined
  const loggedInUserIsAdmin = loggedInUser?.role?.includes('admin')

  if (loggedInUserIsAdmin) {
    const userRoles = new Set(data?.role || [])
    userRoles.add('customer')
    return [...userRoles.values()]
  }

  return ['customer']
}

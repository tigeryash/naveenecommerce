import type { CollectionConfig } from 'payload'
import { authenticated } from '../../../access/authenticated'
import { selfOrAdmin } from '../../../access/selfOrAdmin'
import { anyone } from '@/access/anyone'
import { protectRoles } from './hooks/protectRoles'
import { auth } from '@/lib/auth/auth'

export const Users: CollectionConfig = {
  slug: 'users',
  // access: {
  //   admin: authenticated,
  //   create: anyone,
  //   delete: selfOrAdmin,
  //   read: selfOrAdmin,
  //   update: selfOrAdmin,
  // },
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'better-auth',
        authenticate: async ({ headers, payload }) => {
          try {
            const userSession = await auth.api.getSession({ headers })

            if (!userSession || !userSession.user) return { user: null }

            const userData = await payload.findByID({
              collection: 'users',
              id: userSession?.user?.id,
            })

            return {
              user: {
                ...userData,
                collection: 'users',
              },
            }
          } catch (err) {
            payload.logger.error(err)
            return { user: null }
          }
        },
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },

    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
      saveToJWT: true,
      defaultValue: ['customer'],
      hasMany: true,

      hooks: {
        beforeChange: [protectRoles],
      },
    },

    {
      name: 'wishList',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
  endpoints: [
    {
      path: '/logout',
      method: 'post',
      handler: async (req) => {
        try {
          // First, sign out from Better Auth
          await auth.api.signOut({
            headers: req.headers,
          })

          // Create response with cleared cookies
          const response = new Response(
            JSON.stringify({
              message: 'Logged out successfully',
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )

          // Clear all auth-related cookies
          const cookiesToClear = [
            'payload-token',
            'better-auth.session_token',
            'session-token',
            // Add any other cookies your setup might use
          ]

          cookiesToClear.forEach((cookieName) => {
            response.headers.append(
              'Set-Cookie',
              `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`,
            )
          })

          return response
        } catch (error) {
          console.error('Logout error:', error)
          return new Response(
            JSON.stringify({
              error: 'Logout failed',
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        }
      },
    },
  ],
  timestamps: true,
}

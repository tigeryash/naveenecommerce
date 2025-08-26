export const newDefaultAddress = async ({
  data,
  operation,
  req,
}: {
  data: any
  operation: 'create' | 'update'
  req: any
}) => {
  if (operation === 'create' || operation === 'update') {
    if (data.isDefault && data.user) {
      // Unset the 'isDefault' flag on all other addresses for this user
      await req.payload.update({
        collection: 'shippingInfo',
        where: {
          user: {
            equals: data.user,
          },
          isDefault: {
            equals: true,
          },
        },
        data: {
          isDefault: false,
        },
      })
    }
  }
  return data
}

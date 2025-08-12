import { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const Discounts: CollectionConfig = {
  slug: 'discounts',
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['name', 'code', 'appliesTo', 'percent'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'A name for this discount for internal reference (e.g., "Diwali Sale 2025").',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Discount Details',
          fields: [
            {
              name: 'requiresCode',
              type: 'checkbox',
              label: 'Requires a discount code to be used',
              defaultValue: true,
            },
            {
              name: 'code',
              type: 'text',
              unique: true,
              admin: {
                description:
                  'The code a customer will enter at checkout. Required if the box above is checked.',
                condition: ({ requiresCode }) => requiresCode,
              },
              validate: (value: string | null | undefined, { data }: any) => {
                if (data.requiresCode && !value) {
                  return 'Code is required for this discount type.'
                }
                return true
              },
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Percentage Off', value: 'percentage' },
                { label: 'Fixed Amount Off', value: 'fixedAmount' },
              ],
            },
            {
              name: 'percent',
              label: 'Discount Percentage',
              type: 'number',
              required: true,
              admin: {
                condition: ({ type }) => type === 'percentage',
              },
            },
            {
              name: 'amount',
              label: 'Discount Amount',
              type: 'number',
              required: true,
              admin: {
                condition: ({ type }) => type === 'fixedAmount',
              },
            },
          ],
        },
        {
          label: 'Conditions',
          fields: [
            {
              name: 'appliesTo',
              type: 'select',
              required: true,
              defaultValue: 'order',
              options: [
                { label: 'Entire Order', value: 'order' },
                { label: 'Specific Products', value: 'products' },
                { label: 'Specific Categories', value: 'categories' },
              ],
            },
            {
              name: 'requiredProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              admin: {
                condition: ({ appliesTo }) => appliesTo === 'products',
              },
            },
            {
              name: 'requiredCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                condition: ({ appliesTo }) => appliesTo === 'categories',
              },
            },
            {
              name: 'minimumCartValue',
              type: 'number',
              admin: {
                description: 'The cart total must be at least this amount.',
              },
            },
            {
              name: 'startDate',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'endDate',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          label: 'Usage Limits',
          fields: [
            {
              name: 'usageLimit',
              type: 'number',
              label: 'Total Usage Limit',
              admin: {
                description: 'The total number of times this code can be used by anyone.',
              },
            },
            {
              name: 'usageCount',
              type: 'number',
              defaultValue: 0,
              admin: { readOnly: true },
            },
            {
              name: 'limitPerUser',
              type: 'number',
              label: 'Usage Limit Per User',
              defaultValue: 1,
              admin: {
                description: 'How many times a single logged-in user can use this code.',
              },
            },
          ],
        },
      ],
    },
  ],
}

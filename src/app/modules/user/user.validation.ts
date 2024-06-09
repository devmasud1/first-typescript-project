import { z } from 'zod'

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password can not more then 20 characters' })
    .optional(),

  status: z.enum(['in-progress', 'blocked']).default('in-progress'),
})

export const userValidation = {
  userValidationSchema,
}

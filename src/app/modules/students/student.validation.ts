import { z } from 'zod'

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(10, 'First name cannot exceed 10 characters.')
    .regex(
      /^[A-Z][a-zA-Z]*$/,
      'First name must be capitalized and only contain letters.',
    ),
  middleName: z
    .string()
    .trim()
    .max(10, 'Middle name cannot exceed 10 characters.')
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(10, 'Last name cannot exceed 10 characters.')
    .regex(/^[a-zA-Z]*$/, 'Last name must only contain letters.'),
})

// Define the guardians schema
const guardiansValidationSchema = z.object({
  fatherName: z.string().trim(),
  fatherOccupation: z.string().trim(),

  fatherContactNo: z.string().trim(),

  motherName: z.string().trim(),
  motherOccupation: z.string().trim(),

  motherContactNo: z.string().trim(),
})

// Define the local guardian schema
const localGuardianValidationSchema = z.object({
  name: z.string().trim(),
  occupation: z.string().trim(),
  contactNo: z.string().trim(),
  address: z.string().trim(),
})

// Define the student schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(30),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Gender is not valid.' }),
      }),
      dateOfBirth: z.string().trim().optional(),
      email: z
        .string()
        .trim()
        .email('Email is not valid.')
        .max(100, 'Email cannot exceed 100 characters.'),
      contactNo: z
        .string()
        .trim()
        .max(15, 'Contact number cannot exceed 15 characters.'),
      emergencyContactNo: z
        .string()
        .trim()
        .max(15, 'Emergency contact number cannot exceed 15 characters.'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
          errorMap: () => ({ message: 'Blood group is not valid.' }),
        })
        .optional(),
      presentAddress: z
        .string()
        .trim()
        .max(100, 'Present address cannot exceed 100 characters.'),
      permanentAddress: z
        .string()
        .trim()
        .max(100, 'Permanent address cannot exceed 100 characters.'), // Ensure this is always present
      guardians: guardiansValidationSchema,

      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImage: z.string().trim().optional(),
    }),
  }),
})

export default createStudentValidationSchema

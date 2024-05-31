import Joi from 'joi'

const userNameSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(10)
    .required()
    .custom((value, helpers) => {
      const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)
      if (firstNameStr !== value) {
        return firstNameStr === value
      }
      return value
    }),
  middleName: Joi.string().trim().max(10),
  lastName: Joi.string()
    .trim()
    .max(10)
    .required()
    .regex(/^[A-Za-z]+$/)
    .message('{#label} is not valid'),
})

const guardianSchema = Joi.object({
  fatherName: Joi.string().trim().required(),
  fatherOccupation: Joi.string().trim().required(),
  fatherContactNo: Joi.string().trim().required(),
  motherName: Joi.string().trim().required(),
  motherOccupation: Joi.string().trim().required(),
  motherContactNo: Joi.string().trim().required(),
})

const localGuardianSchema = Joi.object({
  name: Joi.string().trim().required(),
  occupation: Joi.string().trim().required(),
  contactNo: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
})

const studentValidationSchema = Joi.object({
  id: Joi.string().trim().required(),
  name: userNameSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.string().trim(),
  email: Joi.string().trim().max(100).required().email(),
  contactNo: Joi.string().trim().max(15).required(),
  emergencyContactNo: Joi.string().trim().max(15).required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  presentAddress: Joi.string().trim().max(100).required(),
  permanentAddress: Joi.string().trim().max(100),
  guardians: guardianSchema.required(),
  localGuardian: localGuardianSchema.required(),
  profileImage: Joi.string().trim(),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
})

export default studentValidationSchema

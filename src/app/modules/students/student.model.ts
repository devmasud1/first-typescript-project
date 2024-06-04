import { Schema, model } from 'mongoose'
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface'
import validator from 'validator'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name is required.'],
    maxLength: [10, 'First name cannot exceed 10 characters.'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)

        return firstNameStr === value
      },
      message: '{VALUE} is not capitalize formate',
    },
  },
  middleName: {
    type: String,
    trim: true,
    maxLength: [10, 'Middle name cannot exceed 10 characters.'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required.'],
    maxLength: [10, 'Last name cannot exceed 10 characters.'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
})

const guardiansSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, "Father's name is required."],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, "Father's occupation is required."],
  },
  fatherContactNo: {
    type: String,
    trim: true,
    required: [true, "Father's contact number is required."],
  },
  motherName: {
    type: String,
    trim: true,
    required: [true, "Mother's name is required."],
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: [true, "Mother's occupation is required."],
  },
  motherContactNo: {
    type: String,
    trim: true,
    required: [true, "Mother's contact number is required."],
  },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    trim: true,
    required: [true, "Local guardian's name is required."],
  },
  occupation: {
    type: String,
    trim: true,
    required: [true, "Local guardian's occupation is required."],
  },
  contactNo: {
    type: String,
    trim: true,
    required: [true, "Local guardian's contact number is required."],
  },
  address: {
    type: String,
    trim: true,
    required: [true, "Local guardian's address is required."],
  },
})

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      trim: true,
      required: [true, 'Student ID is required.'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user id is required'],
      unique: true,
      ref: 'User',
    },

    name: {
      type: userNameSchema,
      required: [true, "Student's name is required."],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender.',
      },
      required: [true, 'Gender is required.'],
    },
    dateOfBirth: { type: String, trim: true },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required.'],
      unique: true,
      maxLength: [100, 'Email cannot exceed 100 characters.'],
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email',
      },
    },
    contactNo: {
      type: String,
      trim: true,
      required: [true, 'Contact number is required.'],
      maxLength: [15, 'Contact number cannot exceed 15 characters.'],
    },
    emergencyContactNo: {
      type: String,
      trim: true,
      required: [true, 'Emergency contact number is required.'],
      maxLength: [15, 'Emergency contact number cannot exceed 15 characters.'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood group.',
    },
    presentAddress: {
      type: String,
      trim: true,
      required: [true, 'Present address is required.'],
      maxLength: [100, 'Present address cannot exceed 100 characters.'],
    },
    permanentAddress: {
      type: String,
      trim: true,
      maxLength: [100, 'Permanent address cannot exceed 100 characters.'],
    },
    guardians: {
      type: guardiansSchema,
      required: [true, 'Guardian information is required.'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required.'],
    },
    profileImage: { type: String, trim: true },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },

    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
)

//virtual
studentSchema.virtual('fullName').get(function () {
  return `
  ${this.name.firstName} ${this.name.middleName} ${this.name.lastName}
  `
})

//query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } })
  next()
})

studentSchema.pre('findOne', function (next) {
  this.find({ isDelete: { $ne: true } })
  next()
})

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } })
  next()
})

//creating static method
studentSchema.statics.isUserExits = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

//creating custom instance method

// studentSchema.methods.isUserExits = async function () {
//   const existingUser = await Student.findOne({ id: this.id })
//   return existingUser !== null
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema)

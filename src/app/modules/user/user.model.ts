import { Schema, model } from 'mongoose'
import { TUser } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needPasswordChange: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

//pre save middleware / hook
userSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook : save the data')

  //hashing password and save it DB
  const user = this
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt))
  next()
})

userSchema.post('save', function (document, next) {
  // console.log(this, 'post hook : saved the data')

  //empty the response password
  document.password = ''

  next()
})

export const User = model<TUser>('user', userSchema)

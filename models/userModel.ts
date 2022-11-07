import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      default: ''
    },
    admin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
)

const user = model('User', userSchema)

export default user

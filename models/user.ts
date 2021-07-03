import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firsName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      index: true,
      required: true
    },
    birthDate: {
      type: String
    },
    idType: {
      type: String
    },
    idNumber: {
      type: String
    },
    password: {
      type: String
    },
    refreshToken: {
      type: String
    }
  },
  { strict: false }
)

const User = mongoose.model('users', UserSchema)
export default User

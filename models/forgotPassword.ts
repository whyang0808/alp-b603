import mongoose from 'mongoose'

const ForgotPasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: String
    },
    createdAt: {
      type: Date
    },
    tokenHash: {
      type: String
    },
    expirationDate: {
      type: Date
    },
    used: {
      type: Boolean
    }
  },
  { strict: false }
)

const ForgotPassword = mongoose.model('forgotPassword', ForgotPasswordSchema)
export default ForgotPassword

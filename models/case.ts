import mongoose, { Schema } from 'mongoose'

const CaseSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    // TODO: any other fields?
  },
  { strict: false }
)

const Case = mongoose.model('cases', CaseSchema)
export default Case

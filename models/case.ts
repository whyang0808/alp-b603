import mongoose, { Schema } from 'mongoose'
import UserModel from './user'

const CaseSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: UserModel.collection.collectionName
    },
    // TODO: any other fields?
  },
  { strict: false }
)

const Case = mongoose.model('cases', CaseSchema)
export default Case

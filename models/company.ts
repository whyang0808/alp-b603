import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema(
  {
    registrationId: {
      type: String
    },
    name: {
      type: String
    },
    approved: {
      type: Boolean
    }
  },
  { strict: false }
)

const Company = mongoose.model('companies', CompanySchema)
export default Company

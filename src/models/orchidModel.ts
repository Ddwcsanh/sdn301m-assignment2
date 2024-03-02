import mongoose, { PaginateModel, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const Schema = mongoose.Schema

export interface OrchidInterface {
  name: string
  image: string
  price: number
  original: string
  isNatural: boolean
  color: string[]
}

const orchidSchema = new Schema<OrchidInterface>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  original: { type: String, required: true },
  isNatural: { type: Boolean, required: true },
  color: { type: [String], required: true }
})

orchidSchema.plugin(paginate)

interface OrchidsDocument extends OrchidInterface {}

const Orchids = model<OrchidsDocument, PaginateModel<OrchidsDocument>>('Orchids', orchidSchema, 'orchids')

export default Orchids

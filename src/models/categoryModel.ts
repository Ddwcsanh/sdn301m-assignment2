import mongoose, { model } from 'mongoose'

const Schema = mongoose.Schema

export interface CategoryInterface {
  name: string
  description: string
}

const categorySchema = new Schema<CategoryInterface>({
  name: { type: String, required: true },
  description: { type: String, required: true }
})

const Categories = model<CategoryInterface>('Category', categorySchema)

export default Categories

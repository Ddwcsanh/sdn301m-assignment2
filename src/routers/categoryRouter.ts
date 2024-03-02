import express from 'express'
import categoryController from '~/controllers/categoryController'

const categoryRouter = express.Router()

categoryRouter
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.addCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)

categoryRouter
  .route('/:id')
  .post(categoryController.addCategoryById)
  .get(categoryController.getCategoryById)
  .put(categoryController.updateCategoryById)
  .delete(categoryController.deleteCategoryById)

export default categoryRouter

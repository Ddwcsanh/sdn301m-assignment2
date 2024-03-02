import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import Categories from '~/models/categoryModel'
import { ResponseInterface } from '~/models/response'

const { OK, CREATED, BAD_REQUEST, FORBIDDEN, NOT_FOUND } = httpStatus

const categoryController = {
  setContentType: (req: Request, res: Response, next: NextFunction) => {
    res.statusCode = OK
    res.setHeader('Content-Type', 'application/json')
    next()
  },

  getAllCategories: async (req: Request, res: Response) => {
    try {
      const categories = await Categories.find({}).exec()
      const response: ResponseInterface = {
        status: OK,
        message: 'Display all categories',
        data: categories
      }
      res.status(OK).json(response)
    } catch (error: any) {
      res.status(BAD_REQUEST).json({ message: error.message })
    }
  },

  addCategory: async (req: Request, res: Response) => {
    const { body: category } = req
    let response: ResponseInterface
    if (!Object.keys(category).length) {
      response = {
        status: BAD_REQUEST,
        message: 'Body required'
      }
      res.status(BAD_REQUEST).json(response)
    } else {
      try {
        const newCategory = await Categories.insertMany(category)
        response = {
          status: CREATED,
          message: 'Category created',
          data: newCategory
        }
        res.status(CREATED).json(response)
      } catch (error: any) {
        res.status(BAD_REQUEST).json({ message: error.message })
      }
    }
  },

  updateCategory: async (req: Request, res: Response) => {
    const response: ResponseInterface = {
      status: FORBIDDEN,
      message: 'Not support'
    }
    res.status(FORBIDDEN).json(response)
  },

  deleteCategory: async (req: Request, res: Response) => {
    try {
      const categories = await Categories.deleteMany({}).exec()
      const response: ResponseInterface = {
        status: OK,
        message: 'Delete all the categories',
        data: categories
      }
      res.status(OK).json(response)
    } catch (error: any) {
      res.status(BAD_REQUEST).json({ message: error.message })
    }
  },

  getCategoryById: async (req: Request, res: Response) => {
    const categoryId = req.params.id

    try {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryId)

      if (!isValidObjectId) {
        // Respond with an error if the ID is not valid
        const response: ResponseInterface = {
          status: BAD_REQUEST,
          message: 'Invalid category ID format'
        }
        res.status(BAD_REQUEST).json(response)
        return
      }

      const category = await Categories.findById(categoryId).exec()
      if (!category) {
        const response: ResponseInterface = {
          status: NOT_FOUND,
          message: `Data not found`
        }
        res.status(NOT_FOUND).json(response)
      } else {
        const response: ResponseInterface = {
          status: OK,
          message: `Data found!`,
          data: category
        }
        res.status(OK).json(response)
      }
    } catch (error: any) {
      res.status(BAD_REQUEST).json({ message: error.message })
    }
  },

  updateCategoryById: async (req: Request, res: Response) => {
    const categoryId = req.params.id
    const { body: category } = req
    let response: ResponseInterface

    if (!Object.keys(category).length) {
      response = {
        status: BAD_REQUEST,
        message: 'Body required'
      }
      res.status(BAD_REQUEST).json(response)
    } else {
      try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryId)

        if (!isValidObjectId) {
          // Respond with an error if the ID is not valid
          const response: ResponseInterface = {
            status: BAD_REQUEST,
            message: 'Invalid category ID format'
          }
          res.status(BAD_REQUEST).json(response)
          return
        }

        const updatedCategory = await Categories.findByIdAndUpdate(categoryId, category, { new: true }).exec()
        if (!updatedCategory) {
          const response: ResponseInterface = {
            status: NOT_FOUND,
            message: `Data not found`
          }
          res.status(NOT_FOUND).json(response)
        } else {
          const response: ResponseInterface = {
            status: OK,
            message: `Data updated!`,
            data: updatedCategory
          }
          res.status(OK).json(response)
        }
      } catch (error: any) {
        res.status(BAD_REQUEST).json({ message: error.message })
      }
    }
  },
  deleteCategoryById: async (req: Request, res: Response) => {
    const categoryId = req.params.id

    try {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryId)

      if (!isValidObjectId) {
        // Respond with an error if the ID is not valid
        const response: ResponseInterface = {
          status: BAD_REQUEST,
          message: 'Invalid category ID format'
        }
        res.status(BAD_REQUEST).json(response)
        return
      }

      const deletedCategory = await Categories.findByIdAndDelete(categoryId)
      if (!deletedCategory) {
        const response: ResponseInterface = {
          status: NOT_FOUND,
          message: `Data not found`
        }
        res.status(NOT_FOUND).json(response)
      } else {
        const response: ResponseInterface = {
          status: OK,
          message: `Data deleted!`,
          data: deletedCategory
        }
        res.status(OK).json(response)
      }
    } catch (error: any) {
      res.status(BAD_REQUEST).json({ message: error.message })
    }
  },

  addCategoryById: async (req: Request, res: Response) => {
    const response: ResponseInterface = {
      status: FORBIDDEN,
      message: 'Not support'
    }
    res.status(FORBIDDEN).json(response)
  }
}

export default categoryController

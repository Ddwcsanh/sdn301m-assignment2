import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import formidable, { Fields } from 'formidable'
import Orchids, { OrchidInterface } from '~/models/orchidModel'
import { convertStringToColorArray, nameToUrl, urlToName } from '~/utils/utils'

const { OK, CREATED, NOT_FOUND, CONFLICT } = httpStatus

const orchidController = {
  getAllOrchids: async (req: Request, res: Response) => {
    const perPage = 3
    const page = Number(req.params.page) || 1
    try {
      const orchids = await Orchids.find({})
        .skip(perPage * page - perPage)
        .limit(perPage)
        .lean()
        .exec()
      const total = await Orchids.countDocuments()
      if (page > Math.ceil(total / perPage)) {
        res.status(NOT_FOUND).render('error')
        return
      }
      if (req.url.includes('manage')) {
        res.status(OK).render('./pages/manage', {
          orchids: orchids,
          current: page,
          pages: Math.ceil(total / perPage),
          next: page === Math.ceil(total / perPage) ? 0 : page + 1,
          previous: page === 1 ? 0 : page - 1
        })
      } else {
        res.status(OK).render('./pages/orchids', {
          orchids: orchids,
          current: page,
          pages: Math.ceil(total / perPage),
          next: page === Math.ceil(total / perPage) ? 0 : page + 1,
          previous: page === 1 ? 0 : page - 1
        })
      }
    } catch (error: any) {
      res.status(NOT_FOUND).render('error')
    }

    // try {
    //   const orchids = await Orchids.find({}).lean().exec()
    //   if (req.url.includes('manage')) {
    //     res.status(OK).render('./pages/manage', {
    //       orchids: orchids
    //     })
    //   } else {
    //     res.status(OK).render('./pages/orchids', {
    //       orchids: orchids
    //     })
    //   }
    // } catch (error: any) {
    //   res.status(NOT_FOUND).render('error')
    // }
  },

  addOrchid: async (req: Request, res: Response) => {
    const { body: orchid } = req
    const orchids = await Orchids.find({}).lean().exec()

    // Check if an orchid with the same name already exists
    const existingOrchid = orchids.find((o: OrchidInterface) => o.name === orchid.name)

    if (existingOrchid) {
      // Handle duplicate name case
      return res.status(CONFLICT).render('error')
    }
    const colorList = convertStringToColorArray(orchid.color)
    const isNatural = 'isNatural' in orchid
    const newOrchid: OrchidInterface = {
      name: orchid.name,
      image: orchid.image,
      original: orchid.original,
      isNatural: isNatural,
      color: colorList,
      price: orchid.price
    }
    try {
      await Orchids.insertMany(newOrchid)
      res.status(CREATED).redirect('/orchid/manage')
    } catch (error: any) {
      res.status(NOT_FOUND).render('error')
    }
  },

  slug: async (req: Request, res: Response) => {
    const orchidId = req.params.id

    try {
      const orchid = await Orchids.findById(orchidId).lean().exec()
      if (!orchid) {
        res.status(NOT_FOUND).render('error')
      }
      const orchidName = nameToUrl(orchid?.name || '')
      res.redirect(`/orchid/${orchidName}`)
    } catch (error: any) {
      res.status(NOT_FOUND).render('error')
    }
  },

  getOrchidById: async (req: Request, res: Response) => {
    const orchidUrl = req.params.orchidName

    try {
      const orchidName = urlToName(orchidUrl)
      const orchid = await Orchids.findOne({ name: orchidName })
      if (!orchid) {
        res.status(NOT_FOUND).render('error')
        return
      }
      res.status(OK).render('./pages/details', {
        name: orchid.name,
        price: orchid.price,
        image: orchid.image,
        original: orchid.original,
        isNatural: orchid.isNatural,
        color: orchid.color
      })
    } catch (error: any) {
      res.status(NOT_FOUND).render('error')
    }
  },

  updateOrchidById: async (req: Request, res: Response) => {
    const form = formidable({})
    form.parse(req, async (err, fields: Fields) => {
      if (err) {
        return
      }
      const isNatural = 'isNatural' in fields
      const colorList = convertStringToColorArray(fields.color![0])
      const newOrchid: OrchidInterface = {
        name: fields.name![0],
        image: fields.image![0],
        original: fields.original![0],
        isNatural: isNatural,
        color: colorList,
        price: Number(fields.price![0])
      }
      try {
        const orchid = await Orchids.findByIdAndUpdate(req.params.id, newOrchid, {
          new: true
        })
          .lean()
          .exec()
        if (!orchid) {
          res.status(NOT_FOUND).render('error')
        } else {
          const orchids = await Orchids.find({}).lean()
          res.status(OK).render('./pages/manage', {
            orchids: orchids
          })
        }
      } catch (error: any) {
        res.status(NOT_FOUND).render('error')
      }
    })
  },

  deleteOrchidById: async (req: Request, res: Response) => {
    const orchidId = req.params.id

    try {
      const orchid = await Orchids.findByIdAndDelete(orchidId, {
        new: true
      })
        .lean()
        .exec()
      if (!orchid) {
        res.status(NOT_FOUND).render('error')
      } else {
        const orchids = await Orchids.find({}).lean()
        res.status(OK).render('./pages/manage', {
          orchids: orchids
        })
      }
    } catch (error: any) {
      res.status(NOT_FOUND).render('error')
    }
  }
}

export default orchidController

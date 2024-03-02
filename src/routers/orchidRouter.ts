import express from 'express'
import orchidController from '~/controllers/orchidController'

const orchidRouter = express.Router()

orchidRouter.route('/').get(orchidController.getAllOrchids).post(orchidController.addOrchid)

orchidRouter.route('/page/:page').get(orchidController.getAllOrchids)

orchidRouter.route('/manage').get(orchidController.getAllOrchids)

orchidRouter.route('/manage/:page').get(orchidController.getAllOrchids)
orchidRouter.route('/:orchidName').get(orchidController.getOrchidById)
orchidRouter
  .route('/id/:id')
  .get(orchidController.slug)
  .put(orchidController.updateOrchidById)
  .delete(orchidController.deleteOrchidById)

export default orchidRouter

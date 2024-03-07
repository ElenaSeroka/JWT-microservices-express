/**
 * API version 1 resource routes.
 *
 * @author Mats Loock
 * @author Elena Seroka
 * @version 1.0.0
 */

import express from 'express'
import { ResourceController } from '../../../controllers/api/resource-controller.js'

export const router = express.Router()

const controller = new ResourceController()

// ------------------------------------------------------------------------------
//  Routes
// ------------------------------------------------------------------------------

// add all HTTP verbs
router.get('/images', controller.authenticateJWT, controller.getAllImages)

router.post('/images', controller.authenticateJWT, controller.addAnImage)

router.get('/images/:id', controller.authenticateJWT, controller.getImageById)

router.put('/images/:id', controller.authenticateJWT, controller.updateResource)

router.patch('/images/:id', controller.authenticateJWT, controller.updateResource)

router.delete('/images/:id', controller.authenticateJWT, controller.deleteImage)

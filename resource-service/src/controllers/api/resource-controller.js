/**
 * Module for the ResourceController.
 *
 * @author Mats Loock
 * @author Elena Seroka
 * @version 1.0.0
 */

import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import { Image } from '../../models/resource-model.js'
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class ResourceController {
  /**
   * Authenticates requests.
   *
   * If authentication is successful, `req.user`is populated and the
   * request is authorized to continue.
   * If authentication fails, an unauthorized response will be sent.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticateJWT (req, res, next) {
    const authorization = req.headers.authorization?.split(' ')

    if (authorization?.[0] !== 'Bearer') {
      next(createError(401))
      return
    }

    try {
      const publicKey = Buffer.from(process.env.PUBLIC_KEY_64, 'base64')
      jwt.verify(authorization[1], publicKey,
        (error, response) => {
          if (error) {
            console.log('-----------------------------')
            res.sendStatus(403)
          }
          req.user = response.sub
        })
    } catch (err) {
      next(err)
    }
    next()
  }

  /**
   * Updates resource. Because req.method has access to what method the request wants to send (put /patch / delete /get / post) and put and patch functions will look exactly the same, this function can be used for both put and patch.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async updateResource (req, res) {
    try {
      const response = await fetch(process.env.IMAGE_URL + '/' + req.params.id, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.PERSONAL_ACCESS_TOKEN
        },
        body: JSON.stringify(req.body)
      })
      if (response) {
        await Image.findOneAndUpdate({ id: req.params.id }, req.body)
        res.sendStatus(204)
      }
    } catch (error) {
      res.sendStatus(404)
    }
  }

  /**
   * Gets an image by id from database, using req:params.id, which is sent in in the routes after colons : example -> router.get('/images/:id'.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async getImageById (req, res) {
    try {
      let imageById = null
      imageById = await Image.find({ id: req.params.id, userEmail: req.user }).exec()
      if (imageById !== null) {
        res.status(200).send(imageById)
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      res.sendStatus(401)
    }
  }

  /**
   * Gets all images from a certian user in an array from database.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async getAllImages (req, res) {
    try {
      let allImages = null
      allImages = await Image.find({ userEmail: req.user }).exec()

      if (allImages !== null) {
        res.status(200).send(allImages)
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      res.sendStatus(401)
    }
  }

  /**
   * Adds an image to image service, and if this is successful, adds same image to database.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async addAnImage (req, res) {
    try {
      const response = await fetch(process.env.IMAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.PERSONAL_ACCESS_TOKEN
        },
        body: JSON.stringify(req.body)
      })
      const data = await response.json()
      if (data.status === undefined) {
        const image = new Image({
          contentType: req.body.contentType,
          location: req.body.location,
          description: req.body.description,
          userEmail: req.user,
          imageUrl: data.imageUrl,
          id: data.id
        })
        console.log('HELLOOOOOOO')
        await image.save()
        res.sendStatus(201)
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Deletes the specified task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async deleteImage (req, res) {
    try {
      const response = await fetch(process.env.IMAGE_URL + '/' + req.params.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.PERSONAL_ACCESS_TOKEN
        },
        body: JSON.stringify(req.body)
      })
      if (response) {
        await Image.deleteOne({ id: req.params.id })
        res.sendStatus(204)
      }
    } catch (error) {
      res.sendStatus(404)
    }
  }
}

/**
 * Mongoose model Image.
 *
 * @author Elena Serka
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  imageUrl: {
    type: String
  },

  location: {
    type: String
  },

  description: {
    type: String

  },
  id: {
    type: String
  },
  contentType: {
    type: String

  },
  userEmail: {
    type: String
  }
},

{
  timestamps: true,
  versionKey: false

})

// Create an image model using the schema.
export const Image = mongoose.model('Image', schema)

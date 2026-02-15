import mongoose from 'mongoose'
import { petSchema } from '../models/Pet.js'

let petConnectionPromise

function buildPetDatabaseUri(baseUri) {
  if (!baseUri) {
    return ''
  }

  try {
    const parsedUri = new URL(baseUri)
    parsedUri.pathname = '/Web_Project_2'
    return parsedUri.toString()
  } catch (_error) {
    return baseUri
  }
}

export async function getPetModel() {
  if (!petConnectionPromise) {
    const petUri = process.env.PETS_MONGODB_URI || buildPetDatabaseUri(process.env.MONGODB_URI)

    if (!petUri) {
      throw new Error('Set PETS_MONGODB_URI or MONGODB_URI to connect Web_Project_2 database.')
    }

    const connection = mongoose.createConnection(petUri, {
      serverSelectionTimeoutMS: 5000,
    })
    petConnectionPromise = connection.asPromise()
  }

  const connection = await petConnectionPromise
  return connection.models.Pet || connection.model('Pet', petSchema)
}

export async function getPetDatabaseConnection() {
  if (!petConnectionPromise) {
    await getPetModel()
  }
  return await petConnectionPromise
}

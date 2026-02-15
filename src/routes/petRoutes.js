import { Router } from 'express'
import { createPet, deletePet, listPets } from '../controllers/petController.js'

const petRouter = Router()

petRouter.get('/', listPets)
petRouter.post('/', createPet)
petRouter.delete('/:petId', deletePet)

export { petRouter }

import { Router } from 'express'
import { getUserProfile, listUsers, updateUserProfile } from '../controllers/userController.js'

const userRouter = Router()

userRouter.get('/', listUsers)
userRouter.get('/:userId/profile', getUserProfile)
userRouter.put('/:userId/profile', updateUserProfile)

export { userRouter }

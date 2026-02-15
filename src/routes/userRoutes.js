import { Router } from 'express'
import { getUserProfile, updateUserProfile } from '../controllers/userController.js'

const userRouter = Router()

userRouter.get('/:userId/profile', getUserProfile)
userRouter.put('/:userId/profile', updateUserProfile)

export { userRouter }

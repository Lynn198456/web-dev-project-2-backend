import { Router } from 'express'
import { changeUserPassword, getUserProfile, listUsers, updateUserProfile } from '../controllers/userController.js'

const userRouter = Router()

userRouter.get('/', listUsers)
userRouter.get('/:userId/profile', getUserProfile)
userRouter.put('/:userId/profile', updateUserProfile)
userRouter.post('/:userId/change-password', changeUserPassword)

export { userRouter }

import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateOrderBody,
    validateOrdersQuery,
    validateOrdersCurrentUserQuery
 } from '../middlewares/validations'
import { Role } from '../models/user'
import { csrfMiddleware } from '../middlewares/csrf'

const orderRouter = Router()

orderRouter.post('/', auth, csrfMiddleware, validateOrderBody, createOrder)
orderRouter.get(
    '/all',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateOrdersQuery,
    getOrders
)
orderRouter.get('/all/me', auth, validateOrdersCurrentUserQuery, getOrdersCurrentUser)
orderRouter.get(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
)
orderRouter.get('/me/:orderNumber', auth, getOrderCurrentUserByNumber)
orderRouter.patch(
    '/:orderNumber',
    auth,
    csrfMiddleware,
    roleGuardMiddleware(Role.Admin),
    updateOrder
)

orderRouter.delete('/:id', auth, csrfMiddleware, roleGuardMiddleware(Role.Admin), deleteOrder)

export default orderRouter

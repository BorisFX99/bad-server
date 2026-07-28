import { Router } from 'express'
import { csrfMiddleware } from '../middlewares/csrf'

import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateCustomersQuery,
    validateId
 } from '../middlewares/validations'
import { Role } from '../models/user'

const customerRouter = Router()

// Все маршруты только для админов!
customerRouter.get(
    '/',
    auth,
    roleGuardMiddleware(Role.Admin), 
    validateCustomersQuery,
    getCustomers
)

customerRouter.get(
    '/:id',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateId,
    getCustomerById
)

customerRouter.patch(
    '/:id',
    auth,
    roleGuardMiddleware(Role.Admin),
    csrfMiddleware,
    updateCustomer
)

customerRouter.delete(
    '/:id',
    auth,
    roleGuardMiddleware(Role.Admin),
    csrfMiddleware,
    deleteCustomer
)

export default customerRouter

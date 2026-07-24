import { Router } from 'express'
import { csrfMiddleware } from '../middlewares/csrf'

import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth from '../middlewares/auth'
import {
    validateCustomersQuery,
    validateId
 } from '../middlewares/validations'

const customerRouter = Router()

customerRouter.get('/', auth, validateCustomersQuery, getCustomers)
customerRouter.get('/:id', auth, validateId, getCustomerById)
customerRouter.patch('/:id', auth, csrfMiddleware, updateCustomer)
customerRouter.delete('/:id', auth, csrfMiddleware, deleteCustomer)

export default customerRouter

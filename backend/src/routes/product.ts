import { Router } from 'express'
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from '../controllers/products'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateObjId,
    validateProductBody,
    validateProductUpdateBody,
    validateProductsQuery
} from '../middlewares/validations'
import { Role } from '../models/user'
import { csrfMiddleware } from '../middlewares/csrf'

const productRouter = Router()

productRouter.get('/', validateProductsQuery, getProducts)
productRouter.post(
    '/',
    auth,
    csrfMiddleware,
    roleGuardMiddleware(Role.Admin),
    validateProductBody,
    createProduct
)
productRouter.delete(
    '/:productId',
    auth,
    csrfMiddleware,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    deleteProduct
)
productRouter.patch(
    '/:productId',
    auth,
    csrfMiddleware,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    validateProductUpdateBody,
    updateProduct
)

export default productRouter

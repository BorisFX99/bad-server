import { Request, Response, NextFunction } from 'express'
import csurf from 'csurf'
import BadRequestError from '../errors/bad-request-error'

// Создаем CSRF защиту с настройками
export const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    },
})

// Обертка для обработки ошибок CSRF
export const csrfMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // ✅ Проверяем только мутирующие методы
    const methodsToCheck = ['POST', 'PUT', 'PATCH', 'DELETE']
    if (!methodsToCheck.includes(req.method)) {
        return next()
    }

    // ✅ Проверяем, что это не публичные маршруты (логин, регистрация)
    const publicRoutes = ['/login', '/register', '/token']
    if (publicRoutes.some((route) => req.path.includes(route))) {
        return next()
    }

    // ✅ Применяем CSRF защиту
    return csrfProtection(req, res, (err) => {
        if (err) {
            // Обрабатываем ошибку CSRF
            if (err.code === 'EBADCSRFTOKEN') {
                return next(new BadRequestError('Невалидный CSRF токен'))
            }
            return next(err)
        }
        next()
    })
}

// ✅ Генерация CSRF токена для клиента
export const getCsrfToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Генерируем токен и отправляем клиенту
        const token = req.csrfToken()
        res.json({ csrfToken: token })
    } catch (error) {
        next(error)
    }
}

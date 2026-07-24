import rateLimit from 'express-rate-limit'

//  Общий лимит для всех запросов
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP
    message: {
        success: false,
        error: 'Слишком много запросов. Пожалуйста, повторите позже.',
    },
    standardHeaders: true,
    legacyHeaders: false,
})

//  Строгий лимит для логина (защита от брутфорса)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 10, // максимум 10 попыток входа
    skipSuccessfulRequests: true,
    message: {
        success: false,
        error: 'Слишком много попыток входа. Попробуйте через 15 минут.',
    },
    standardHeaders: true,
    legacyHeaders: false,
})

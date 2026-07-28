import rateLimit  from 'express-rate-limit'

export const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 минута
    limit: 50, // В версии 8.x используется `limit`, а не `max`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
      success: false,
      error: "Слишком много запросов. Пожалуйста, повторите позже."
    });
  },
})

//  Строгий лимит для логина (защита от брутфорса)
export const authLimiter = rateLimit({
    windowMs: 15 * 1000, // 15 минут
    limit: 10, // 10 попыток входа
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    statusCode: 429,
    message: {
        success: false,
        error: 'Слишком много попыток входа. Попробуйте через 15 минут.',
    },
})

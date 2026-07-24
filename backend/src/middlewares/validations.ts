import { Joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'

// eslint-disable-next-line no-useless-escape
export const phoneRegExp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

// валидация id
export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'Невалидный id' })
                })
            )
            .messages({
                'array.empty': 'Не указаны товары',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                'string.empty': 'Не указан способ оплаты',
            }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Не указан email',
        }),
        phone: Joi.string().required().pattern(phoneRegExp).messages({
            'string.empty': 'Не указан телефон',
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Не указан адрес',
        }),
        total: Joi.number().required().messages({
            'string.empty': 'Не указана сумма заказа',
        }),
        comment:
        Joi.string()
        .optional()
        .allow('')
        .max(1000)  // ✅ Ограничение длины
        .messages({
            'string.max': 'Комментарий не должен превышать 1000 символов',
        }),
    }),
})

// валидация товара.
// name и link - обязательные поля, name - от 2 до 30 символов, link - валидный url
export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
            'string.empty': 'Поле "title" должно быть заполнено',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string().required().messages({
            'string.empty': 'Поле "category" должно быть заполнено',
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Поле "description" должно быть заполнено',
        }),
        price: Joi.number().allow(null),
    }),
})

// Валидация query-параметров для getProducts
export const validateProductsQuery = celebrate({
    query: Joi.object().keys({
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                'number.integer': 'Страница должна быть целым числом',
                'number.min': 'Страница должна быть больше 0',
                'number.base': 'Страница должна быть числом',
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .default(10)
            .messages({
                'number.integer': 'Лимит должен быть целым числом',
                'number.min': 'Лимит должен быть больше 0',
                'number.base': 'Лимит должен быть числом',
            }),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string(),
        description: Joi.string(),
        price: Joi.number().allow(null),
    }),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
            }),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.required': 'Поле "email" должно быть заполнено',
            }),
        password: Joi.string().required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
    }),
})

// валидация query параметров для getOrders
export const validateOrdersQuery = celebrate({
    query: Joi.object().keys({
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                'number.integer': 'Страница должна быть целым числом',
                'number.min': 'Страница должна быть больше 0',
                'number.base': 'Страница должна быть числом',
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .default(10)
            .messages({
                'number.integer': 'Лимит должен быть целым числом',
                'number.min': 'Лимит должен быть больше 0',
                'number.base': 'Лимит должен быть числом',
            }),
        sortField: Joi.string()
            .valid('createdAt', 'orderNumber', 'totalAmount', 'status')
            .default('createdAt')
            .messages({
                'string.valid': 'Недопустимое поле для сортировки',
            }),
        sortOrder: Joi.string()
            .valid('asc', 'desc')
            .default('desc')
            .messages({
                'string.valid': 'Недопустимый порядок сортировки',
            }),
        status: Joi.string()
            .valid('new', 'delivering', 'completed', 'cancelled')
            .messages({
                'string.valid': 'Недопустимый статус заказа',
            }),
        totalAmountFrom: Joi.number()
            .min(0)
            .messages({
                'number.min': 'Сумма должна быть больше или равна 0',
                'number.base': 'Сумма должна быть числом',
            }),
        totalAmountTo: Joi.number()
            .min(0)
            .messages({
                'number.min': 'Сумма должна быть больше или равна 0',
                'number.base': 'Сумма должна быть числом',
            }),
        orderDateFrom: Joi.date()
            .messages({
                'date.base': 'Невалидная дата',
            }),
        orderDateTo: Joi.date()
            .messages({
                'date.base': 'Невалидная дата',
            }),
        search: Joi.string()
            .max(100)
            .allow('')
            .messages({
                'string.max': 'Поисковый запрос не должен превышать 100 символов',
            }),
    }),
})

// Валидация query-параметров для getOrdersCurrentUser
export const validateOrdersCurrentUserQuery = celebrate({
    query: Joi.object().keys({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.integer': 'Страница должна быть целым числом',
                'number.min': 'Страница должна быть больше 0',
                'number.base': 'Страница должна быть числом',
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .default(5)
            .messages({
                'number.integer': 'Лимит должен быть целым числом',
                'number.min': 'Лимит должен быть больше 0',
                'number.base': 'Лимит должен быть числом',
            }),
        search: Joi.string()
            .max(100)
            .allow('')
            .messages({
                'string.max': 'Поисковый запрос не должен превышать 100 символов',
            }),
    }),
})

// Валидация query-параметров для getCustomers
export const validateCustomersQuery = celebrate({
    query: Joi.object().keys({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.integer': 'Страница должна быть целым числом',
                'number.min': 'Страница должна быть больше 0',
                'number.base': 'Страница должна быть числом',
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .default(10)
            .messages({
                'number.integer': 'Лимит должен быть целым числом',
                'number.min': 'Лимит должен быть больше 0',
                'number.base': 'Лимит должен быть числом',
            }),
        sortField: Joi.string()
            .valid('createdAt', 'name', 'totalAmount', 'orderCount')
            .default('createdAt')
            .messages({
                'string.valid': 'Недопустимое поле для сортировки',
            }),
        sortOrder: Joi.string()
            .valid('asc', 'desc')
            .default('desc')
            .messages({
                'string.valid': 'Недопустимый порядок сортировки',
            }),
        registrationDateFrom: Joi.date()
            .messages({
                'date.base': 'Невалидная дата',
            }),
        registrationDateTo: Joi.date()
            .messages({
                'date.base': 'Невалидная дата',
            }),
        lastOrderDateFrom: Joi.date()
            .messages({
                'date.base': 'Невалидная дата',
            }),
        lastOrderDateTo: Joi.date()
            .messages({
                'date.base': 'Невалидная дата',
            }),
        totalAmountFrom: Joi.number()
            .min(0)
            .messages({
                'number.min': 'Сумма должна быть больше или равна 0',
                'number.base': 'Сумма должна быть числом',
            }),
        totalAmountTo: Joi.number()
            .min(0)
            .messages({
                'number.min': 'Сумма должна быть больше или равна 0',
                'number.base': 'Сумма должна быть числом',
            }),
        orderCountFrom: Joi.number()
            .integer()
            .min(0)
            .messages({
                'number.integer': 'Количество заказов должно быть целым числом',
                'number.min': 'Количество заказов должно быть больше или равно 0',
                'number.base': 'Количество заказов должно быть числом',
            }),
        orderCountTo: Joi.number()
            .integer()
            .min(0)
            .messages({
                'number.integer': 'Количество заказов должно быть целым числом',
                'number.min': 'Количество заказов должно быть больше или равно 0',
                'number.base': 'Количество заказов должно быть числом',
            }),
        search: Joi.string()
            .max(100)
            .allow('')
            .messages({
                'string.max': 'Поисковый запрос не должен превышать 100 символов',
            }),
    }),
})

// Валидация ID для пользователей, заказов и т.д.
export const validateId = celebrate({
    params: Joi.object().keys({
        id: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

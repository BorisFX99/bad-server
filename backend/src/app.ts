import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { PORT, DB_ADDRESS, ORIGIN_ALLOW } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import { globalLimiter } from './middlewares/rateLimiter'

const app = express()

app.use(cors({
    origin: ORIGIN_ALLOW,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'CSRF-Token'],
}));
// app.use(express.static(path.join(__dirname, 'public')));

// Добавляем глобальный лимит для всех запросов
app.use(globalLimiter)

app.use(cookieParser())

app.use(urlencoded({
    extended: true,
    limit: '10mb'
}))
app.use(json({
    limit: '10mb'
}))

app.use(serveStatic(path.join(__dirname, 'public')))

app.options('*', cors())
app.use(routes)
app.use(errors())
app.use(errorHandler)

 

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()

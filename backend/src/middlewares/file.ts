import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const destinationPath = join(
            __dirname,
            process.env.UPLOAD_PATH_TEMP
                ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                : '../public'
        )

        mkdirSync(destinationPath, { recursive: true })

        cb(null, destinationPath)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
         // ✅ Безопасное имя файла
        const ext = file.originalname.split('.').pop() || ''
        const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '')  // Только буквы и цифры

        // ✅ Уникальное имя с временной меткой
        const timestamp = Date.now()
        const random = randomBytes(8).toString('hex')
        const safeName = `${timestamp}-${random}.${safeExt}`
        cb(null, safeName)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
    'image/webp',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
       return cb(new Error('Неподдерживаемый тип файла. Разрешены: PNG, JPG, JPEG, GIF, SVG, WebP'))
    }

    return cb(null, true)
}
// ✅ Добавляем ограничения
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // ✅ 5MB максимум
        files: 1, // ✅ Только 1 файл
    },
})

export default upload

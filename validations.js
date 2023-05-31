import { body } from 'express-validator'

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимальная длина пароля: 8 символов').isLength({ min:  8}),
]

export const registerValidation = [
    body('fullName', 'Укажите имя').isLength({ min: 2 }),
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимальная длина пароля: 5 символов').isLength({ min: 8 }),
]

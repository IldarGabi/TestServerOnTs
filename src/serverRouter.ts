import { Router, Request, Response } from 'express';
import controller from './authController';
import { check, ValidationChain } from 'express-validator';
import authMiddleware from './middleware/authMiddleware';
import roleMiddleware from './middleware/roleMiddleware';

const serverRouter = Router();

// запрос для регистрации
const registrationValidation: ValidationChain[] = [
    check('username', 'Username can\'t be empty!').notEmpty(),
    check('password', 'The password must be at least 4 and no more than 10 characters long.').isLength({ min: 4, max: 10 }),
];

// запрос для логина
serverRouter.post('/registration', registrationValidation, controller.registration);
serverRouter.post('/login', controller.login);

// запрос для получения записей пользователей
serverRouter.get('/users', [authMiddleware, roleMiddleware(['ADMIN'])], controller.getUsers);

export default serverRouter;

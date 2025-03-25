import jwt from 'jsonwebtoken';
import conf from '../config';
import {NextFunction, Request, Response} from "express";


declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

async function authMiddleware(request: Request, response: Response, next: NextFunction): Promise<void> {
    if (request.method === "OPTIONS") {
        return next();
    }

    try {
        const token = request.headers.authorization?.split(' ')[1];

        if(!token) {
            response.status(403).json({message: 'The user is not logged in'})
            return;
        }

        // добавление данных пользователя в объект запроса
        request.user = jwt.verify(token, conf.secret);
        next();
    } catch (error) {
        console.log(error);
        response.status(403).json({message: 'The user is not logged in'})
        return;
    }
}

export default authMiddleware;

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

async function authMiddleware(request: Request, response: Response, next: NextFunction): Promise<any> {
    if (request.method === "OPTIONS") {
        return next();
    }

    try {
        const token = request.headers.authorization?.split(' ')[1];

        if(!token) {
            return response.status(403).json({message: 'The user is not logged in'})
        }

        // добавление данных пользователя в объект запроса
        request.user = jwt.verify(token, conf.secret);
        next();
    } catch (error) {
        console.log(error);
        return response.status(403).json({message: 'The user is not logged in'})
    }
}

export default authMiddleware;
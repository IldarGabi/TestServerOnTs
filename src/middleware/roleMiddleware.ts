import jwt from 'jsonwebtoken';
import conf from '../config';
import { NextFunction, Request, Response } from "express";

// интерфейс для данных в токене
interface TokenPayload {
    roles: string[];
}

function roleMiddleware(roles: string[]): any {
    return function (request: Request, response: Response, next: NextFunction) {
        // обработка метода OPTIONS
        if (request.method === "OPTIONS") {
            return next();
        }

        try {
            const token = request.headers.authorization?.split(' ')[1];

            if (!token) {
                return response.status(403).json({ message: 'The user is not logged in' });
            }

            // проверка токена и извлечение ролей
            const { roles: userRoles } = jwt.verify(token, conf.secret) as TokenPayload;

            // проверка наличия хотя бы одной роли из разрешенных
            const hasRole = userRoles.some(role => roles.includes(role));

            if (!hasRole) {
                return response.status(403).json({ message: 'Permission denied' });
            }

            next();
        } catch (error) {
            console.error(error);
            return response.status(403).json({ message: 'The user is not logged in' });
        }
    }
}

export default roleMiddleware;
import jwt from 'jsonwebtoken';
import conf from '../config';
import { NextFunction, Request, Response, RequestHandler } from "express";

// интерфейс для данных в токене
interface TokenPayload {
    roles: string[];
}

function roleMiddleware(roles: string[]): RequestHandler {
    return function (request: Request, response: Response, next: NextFunction): void {
        // обработка метода OPTIONS
        if (request.method === "OPTIONS") {
            return next();
        }

        try {
            const token = request.headers.authorization?.split(' ')[1];

            if (!token) {
                response.status(403).json({ message: 'The user is not logged in' });
                return;
            }

            // проверка токена и извлечение ролей
            const { roles: userRoles } = jwt.verify(token, conf.secret) as TokenPayload;

            // проверка наличия хотя бы одной роли из разрешенных
            const hasRole = userRoles.some(role => roles.includes(role));

            if (!hasRole) {
                response.status(403).json({ message: 'Permission denied' });
                return;
            }

            next();
        } catch (error) {
            console.error(error);
            response.status(403).json({ message: 'The user is not logged in' });
            return;
        }
    }
}

export default roleMiddleware;

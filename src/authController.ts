import { Request, Response } from 'express';
import Users, { IUser } from './dbModels/user';
import Roles from './dbModels/role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import conf from './config';

// генерация токена доступа
const generateAccessToken = (id: string, roles: string[]): string => {
    const payload = {
        id,
        roles
    };
    return jwt.sign(payload, conf.secret, { expiresIn: "12h" });
}

class AuthorizationController {
    // регистрация пользователя
    async registration(request: Request, response: Response): Promise<any> {
        try {
            const validErrors = validationResult(request);

            if (!validErrors.isEmpty()) {
                return response.status(400).json({ message: 'Error on registration', validErrors });
            }

            const { username, password } = request.body;
            const candidate = await Users.findOne({ username });

            if (candidate) {
                return response.status(400).json({ message: `User with name: ${username} already exists` });
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Roles.findOne({ value: 'ADMIN' });
            const user = new Users({ username, password: hashPassword, roles: [userRole?.value] });

            await user.save();

            return response.json({ message: 'The user was successfully created' });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Registration completed with error', error });
        }
    }

    // логин пользователя
    async login(request: Request, response: Response): Promise<any> {
        try {
            const { username, password } = request.body;
            const user: IUser | null = await Users.findOne({ username });

            if (!user) {
                return response.status(400).json({ message: `User ${username} was not found` });
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return response.status(400).json({ message: `Incorrect password or username` });
            }

            const token = generateAccessToken(user._id.toString(), user.roles);
            return response.json({ token });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Login completed with error' });
        }
    }

    // получение списка пользоваателей из БД
    async getUsers(request: Request, response: Response): Promise<any> {
        try {
            const users = await Users.find();
            return response.json(users);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Error fetching users', error });
        }
    }
}

export default new AuthorizationController();
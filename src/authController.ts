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
    async registration(request: Request, response: Response): Promise<void> {
        try {
            const validErrors = validationResult(request);

            if (!validErrors.isEmpty()) {
                response.status(400).json({ message: 'Error on registration', validErrors });
                return;
            }

            const { username, password } = request.body;
            const candidate = await Users.findOne({ username });

            if (candidate) {
                response.status(400).json({ message: `User with name: ${username} already exists` });
                return;
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Roles.findOne({ value: 'ADMIN' });
            const user = new Users({ username, password: hashPassword, roles: [userRole?.value] });

            await user.save();

            response.json({ message: 'The user was successfully created' });
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Registration completed with error', error });
            return; 
        }
    }

    // логин пользователя
    async login(request: Request, response: Response): Promise<void> {
        try {
            const { username, password } = request.body;
            const user: IUser | null = await Users.findOne({ username });

            if (!user) {
                response.status(400).json({ message: `Incorrect password or username` });
                return;
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                response.status(400).json({ message: `Incorrect password or username` });
                return;
            }

            const token = generateAccessToken(user._id.toString(), user.roles);
            response.json({ token });
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Login completed with error' });
            return;
        }
    }

    // получение списка пользоваателей из БД
    async getUsers(request: Request, response: Response): Promise<void> {
        try {
            const users = await Users.find();
            response.json(users);
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Error fetching users', error });
            return;
        }
    }
}

export default new AuthorizationController();

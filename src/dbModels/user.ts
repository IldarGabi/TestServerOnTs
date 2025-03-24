import {Schema, Document, model} from 'mongoose';

// итерфейс для пользователя
export interface IUser extends Document {
    _id: string;
    username: string;
    password: string;
    roles: string[];
}

// определение схемы для пользователя
const UserSchema = new Schema<IUser>(
    {
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: false,
        required: true
    },
    roles: [{
            type: String,
            ref: 'Role'
        }],
}
);

export default model<IUser>('User', UserSchema);
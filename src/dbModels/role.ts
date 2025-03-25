import {Schema, model, Document} from 'mongoose';

enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MODERATOR = 'MODERATOR',
    GUEST = 'GUEST'
}

// интерфейс для роли
interface IRole extends Document {
    value: UserRole;
}

// определение схемы для роли
const RoleSchema = new Schema<IRole>({
    value: {
        type: String,
        enum: Object.values(UserRole),
        unique: true,
        default: UserRole.USER
    },
});

export default model<IRole>('Role', RoleSchema);

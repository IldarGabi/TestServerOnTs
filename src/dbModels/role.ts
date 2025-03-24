import {Schema, model, Document} from 'mongoose';

// интерфейс для роли
interface IRole extends Document {
    value: string;
}

// определение схемы для роли
const RoleSchema = new Schema<IRole>({
    value: {
        type: String,
        unique: true,
        default: 'USER'
    },
});

export default model<IRole>('Role', RoleSchema);

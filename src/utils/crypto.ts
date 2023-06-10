import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants';

export const encrypt = async (plain: string) => {
    const hash = await bcrypt.hash(plain, SALT_ROUNDS);

    return hash;
}

export const compare = async (plain: string, hash: string) => {
    return bcrypt.compare(plain, hash);
}

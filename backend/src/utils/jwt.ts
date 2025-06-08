import jwt from 'jsonwebtoken';

const SECRET_KEY = 'mi_secreto_super_seguro';

export const generarToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '14d' });
};

export const verificarToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};
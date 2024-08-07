import { Request } from "express";


function getTokenFromHeader(req: Request): string {
    const authHeader: string = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token: string = authHeader.substring(7);
        return token;
    }

    return '';
}

export {
    getTokenFromHeader,
}
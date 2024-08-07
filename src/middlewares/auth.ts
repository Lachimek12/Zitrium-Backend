import passport from 'passport';
import { Request, Response, NextFunction } from "express";
import { ErrorType } from '@/types/enums';
import { asyncHandler } from '@middlewares/asyncHandler';
import { getTokenFromHeader } from '@utils/common';

const redisClient = require('@config/redis');


async function isTokenRevoked(token: string): Promise<boolean> {
    if (await redisClient.exists(token)) {
        return true;
    }
    return false;
}

module.exports = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token: string = getTokenFromHeader(req);

    if (await isTokenRevoked(token)) {
        return next(new Error(ErrorType.TokenExpired));
    }

    passport.authenticate('jwt', { session: false })(req, res, next);
});
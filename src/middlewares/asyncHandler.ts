import { Request, Response, NextFunction } from "express";
import { AsyncHandlerFunction } from "../types/middleware.types";


export const asyncHandler = (fn: AsyncHandlerFunction) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
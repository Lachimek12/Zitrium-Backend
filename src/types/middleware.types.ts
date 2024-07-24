import { Request, Response, NextFunction } from "express";

export type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
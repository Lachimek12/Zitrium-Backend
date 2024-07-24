"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error(error);
        res.status(500).send("HA! nygger");
    });
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map
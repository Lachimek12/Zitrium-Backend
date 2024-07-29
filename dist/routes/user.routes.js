"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const router = require("express").Router();
router.post('/register', userController_1.registerUser);
router.post('/register/resend-verify', userController_1.resendVerificationEmail);
router.get('/verify-email', userController_1.verifyEmail);
module.exports = router;
//# sourceMappingURL=user.routes.js.map
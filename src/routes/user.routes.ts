import { registerUser, resendVerificationEmail, verifyEmail } from '../controllers/userController';

const router = require("express").Router();


router.post('/register', registerUser);
router.post('/register/resend-verify', resendVerificationEmail);
router.get('/verify-email', verifyEmail);

module.exports = router;
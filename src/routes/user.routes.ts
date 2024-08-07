import { loginUser, logoutUser, registerUser, resendVerificationEmail, verifyEmail } from '@controllers/user.controller';

const router = require("express").Router();
const auth = require('@middlewares/auth');


router.post('/register', registerUser);
router.post('/register/resend-verify', resendVerificationEmail);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/logout', auth, logoutUser);

module.exports = router;
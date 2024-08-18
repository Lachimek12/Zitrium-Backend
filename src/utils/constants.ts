// Dotenv comes here to ensure that .env file is loaded before constants are
import * as dotenv from 'dotenv';
dotenv.config();



// Define a port to listen on
export const PORT: string = process.env.PORT || '3000';

// Define a port on which frontend is listening on
export const CLIENT_PORT: string = process.env.CLIENT_PORT || '3001';

// MongoDB connection string
export const MONGO_URI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/demoDB';

// Mailgun
export const EMAIL: string = process.env.EMAIL || 'email';
export const MAILGUN_API_KEY: string = process.env.MAILGUN_API_KEY || 'key';
export const VERIFICATION_EXPIRE_SEC: number = 60*10;
export const VERIFICATION_LENGTH: number = 6;
export const VERIFICATION_RESEND_COOLDOWN_SEC: number = 30;
export const TIME_TO_DELETE_NOT_VERIFIED_USER_SEC: number = 60*60;

// Password hashing
export const BCRYPT_SALT_ROUNDS: number = Number(process.env.BCRYPT_SALT_ROUNDS) || 1;

// JWT
export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'ukulele2';
export const JWT_TOKEN_EXPIRE_TIME: string = '8h';
export const USED_JWT_TOKEN_EXPIRE_SEC: number = 60*60*24*14; // 2 weeks
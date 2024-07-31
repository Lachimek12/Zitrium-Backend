// Dotenv comes here to ensure that .env file is loaded before constants are
import * as dotenv from 'dotenv';
dotenv.config();



// Define a port to listen on
export const PORT = process.env.PORT || 3000;

// Define a port on which frontend is listening on
export const CLIENT_PORT = process.env.CLIENT_PORT || 3001;

// MongoDB connection string
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demoDB';

// Mailgun
export const EMAIL = process.env.EMAIL || 'email';
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || 'key';
export const VERIFICATION_EXPIRE = '3m';
export const VERIFICATION_LENGTH = 6;
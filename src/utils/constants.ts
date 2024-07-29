// Define a port to listen on
export const PORT = process.env.PORT || 3000;

// Define a port on which frontend is listening on
export const CLIENT_PORT = process.env.CLIENT_PORT || 3001;

// MongoDB connection string
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demoDB';

// Nodemailer
export const EMAIL = process.env.EMAIL || 'email';
export const PASSWORD = process.env.PASSWORD || 'password';
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';

// JWT
export const JWT_KEY = process.env.JWT_KEY || 'ukulele2';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
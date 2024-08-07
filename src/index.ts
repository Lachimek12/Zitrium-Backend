//!!!!!!!!!!!!!!!!!
//ALWAYS RUN BUILD TO MAKE CHANGES ON SERVER
//!!!!!!!!!!!!!!!!!

import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from '@config/mongo';
import { PORT, MONGO_URI } from '@utils/constants';
import passport from 'passport';

const homePageRoutes = require('@routes/homePage.routes');
const accountRoutes = require('@routes/user.routes');
const errorHandler = require('@middlewares/errorHandler');


// Create an instance of express
const app = express();

// Start MongoDB
connectToMongoDB(MONGO_URI);

// Middleware to parse JSON requests
app.use(express.json());
// Allow communication between local ports
app.use(cors());
// Middleware for authentication
app.use(passport.initialize());
require('@config/passport');
require('@config/redis');

// Routes
app.use(homePageRoutes);
app.use(accountRoutes);
// Use middleware for error handling
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
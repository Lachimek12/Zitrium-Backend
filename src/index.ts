//!!!!!!!!!!!!!!!!!
//ALWAYS RUN BUILD TO MAKE CHANGES ON SERVER
//!!!!!!!!!!!!!!!!!


import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';
import { connectToMongoDB } from './config/database/mongo';
import { PORT, MONGO_URI } from './utils/constants';

const homePageRoutes = require('./routes/homePage.routes');

fs;

// Create an instance of express
const app = express();

// Start MongoDB
connectToMongoDB(MONGO_URI);

// Middleware to parse JSON requests
app.use(express.json());
// Allow communication between local ports
app.use(cors());
// Use routes
app.use(homePageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//!!!!!!!!!!!!!!!!!
//ALWAYS RUN BUILD TO MAKE CHANGES ON SERVER
//!!!!!!!!!!!!!!!!!


//import modules
import express, { Request, Response } from 'express';
import mongoose, {Document} from 'mongoose';
import fs from 'fs';
import cors from 'cors';

fs;

//create an instance of express
const app = express();

// Define a port to listen on
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demoDB';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error: Error) => {
  console.error('Error connecting to MongoDB:', error);
});

var nameSchema = new mongoose.Schema({
  firstName: String,
  lastNameName: String
});

var User = mongoose.model("User", nameSchema);

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Define a basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get("/api", async (req: Request, res: Response) => {
  try {
    // Find the user by ID
    const user = await User.findOne();

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Respond with the user data
    res.status(200).json({name: user.firstName, email: user.lastNameName});
} catch (error) {
    // Handle errors
    console.error('Error retrieving user data:', error);
    res.status(500).send('Error retrieving user data');
}
});

app.post('/api', async (req: Request, res: Response) => {
  const userData = req.body;

  try {
      console.log(userData.name);
      console.log(userData.email);

      const myData = new User({
        firstName: userData.name,
        lastNameName: userData.email,
      });
      await myData.save();

      // Respond with a success message
      res.status(201).send('User data saved successfully');
  } catch (error) {
      // Handle errors
      console.error('Error saving user data:', error);
      res.status(500).send('Error saving user data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
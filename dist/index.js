"use strict";
//!!!!!!!!!!!!!!!!!
//ALWAYS RUN BUILD TO MAKE CHANGES ON SERVER
//!!!!!!!!!!!!!!!!!
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import modules
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
fs_1.default;
//create an instance of express
const app = (0, express_1.default)();
// Define a port to listen on
const PORT = process.env.PORT || 3000;
// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demoDB';
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
var nameSchema = new mongoose_1.default.Schema({
    firstName: String,
    lastNameName: String
});
var User = mongoose_1.default.model("User", nameSchema);
// Middleware to parse JSON requests
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Define a basic route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.get("/api", async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findOne();
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Respond with the user data
        res.status(200).json({ name: user.firstName, email: user.lastNameName });
    }
    catch (error) {
        // Handle errors
        console.error('Error retrieving user data:', error);
        res.status(500).send('Error retrieving user data');
    }
});
app.post('/api', async (req, res) => {
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
    }
    catch (error) {
        // Handle errors
        console.error('Error saving user data:', error);
        res.status(500).send('Error saving user data');
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
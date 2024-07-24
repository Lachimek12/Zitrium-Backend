"use strict";
//!!!!!!!!!!!!!!!!!
//ALWAYS RUN BUILD TO MAKE CHANGES ON SERVER
//!!!!!!!!!!!!!!!!!
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const mongo_1 = require("./config/database/mongo");
const constants_1 = require("./utils/constants");
const homePageRoutes = require('./routes/homePage.routes');
fs_1.default;
// Create an instance of express
const app = (0, express_1.default)();
// Start MongoDB
(0, mongo_1.connectToMongoDB)(constants_1.MONGO_URI);
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Allow communication between local ports
app.use((0, cors_1.default)());
// Use routes
app.use(homePageRoutes);
// Start the server
app.listen(constants_1.PORT, () => {
    console.log(`Server is running on port ${constants_1.PORT}`);
});
//# sourceMappingURL=index.js.map
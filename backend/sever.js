import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import axios from 'axios';
import cors from 'cors';
import path from 'path';

import recipeRoutes from './routes/recipe.route.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express(); // Initializes a new Express.js application instance
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enables CORS for cross-origin requests
app.use(express.json()); // Allows us to accept JSON data in the request body


app.listen(PORT, () => {
    connectDB(); // Connect to DB after starting the server
    console.log(`Server started at http://localhost:${PORT}`);
});
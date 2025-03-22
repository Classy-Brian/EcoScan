// backend/server.js
import express from 'express';
import dotenv from "dotenv";
dotenv.config(); 

import cors from 'cors';
import { connectDB } from './config/db.js';

import axios from 'axios';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Allows us to accept JSON data in the req body
app.use(cors());

// API route to fetch product data
app.get('/api/product/:barcode', async (req, res) => {
    const barcode = req.params.barcode;
    const url = `https://world.openfoodfacts.org/api/v3/product/${barcode}`;
    
    console.log("Barcode:", barcode); // Log the barcode
    console.log("Requesting URL:", url); // Log the constructed URL

  try {
    const response = await axios.get(url);

    // Check for a successful response (status code 200)
    if (response.status === 200) {
        // Check if the product was found (Open Food Facts returns status 0 if not found)
        res.json(response.data.product);
        if(response.data.status === 1) {
            res.json(response.data.product); // Send the product data
        } else {
            res.status(404).json({ error: 'Product not found' }); // 404 Not Found
        }

    } else {
      // Handle other HTTP errors
      res.status(response.status).json({ error: `Open Food Facts API error: ${response.status}` });
    }

  } catch (error) {
    console.error("Error fetching product info:", error);

     // Handle Axios errors (e.g., network issues)
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status).json({ error: `Open Food Facts API error: ${error.response.status}` });
        } else if (error.request) {
            // The request was made but no response was received
            res.status(500).json({ error: 'No response from Open Food Facts API' });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({ error: 'Error fetching product data' });
        }
  }
});

app.listen(PORT, () => {
    connectDB(); // Connect to DB after starting server
    console.log(`Server started at http://localhost:${PORT}`);
});
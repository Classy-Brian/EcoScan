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
    const url = `https://world.openfoodfacts.org/api/v3/product/${barcode}?fields=product_name,image_url,packagings`; 
    
    console.log("Barcode:", barcode); 
    console.log("Requesting URL:", url); 

  try {
    const response = await axios.get(url);

    // Check for a successful response (status code 200)
    if (response.status === 200) {
        // Check if the product was found (Open Food Facts returns status 0 if not found)
        const productData = response.data.product;

        res.json(productData);

    } else {
      // Handle other HTTP errors
      res.status(response.status).json({ error: `Open Food Facts API error: ${response.status}` });
    }

  } catch (error) {
    console.error("Error fetching product info:", error);

     // Handle Axios errors 
        if (error.response) {
            res.status(error.response.status).json({ error: `Open Food Facts API error: ${error.response.status}` });
        } else if (error.request) {
            res.status(500).json({ error: 'No response from Open Food Facts API' });
        } else {

            res.status(500).json({ error: 'Error fetching product data' });
        }
  }
});

app.get('/api/chatgpt', async (req, res) => {
    const genAI = new GoogleGenerativeAI(process.env.APIKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = "Explain how AI works in a few words";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

});

app.listen(PORT, () => {
    connectDB(); // Connect to DB after starting server
    console.log(`Server started at http://localhost:${PORT}`);

    
});
// backend/server.js
import express from 'express';


import cors from 'cors';


import axios from 'axios';

import { createRequire } from 'module'
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"

dotenv.config();
const API_KEY = "AIzaSyA5lO6r-NK1kDgQh_zIVgYY--YRUv0CJec"
const genAI = new GoogleGenerativeAI(API_KEY)


const app = express();
const PORT =  5000;


app.use(express.json()); // Allows us to accept JSON data in the req body
app.use(cors());




//API





// API route to fetch product data
app.get('/api/product/:barcode', async (req, res) => {
    const barcode = req.params.barcode;
    const url = `https://world.openfoodfacts.org/api/v3/product/${barcode}`; 
    
    console.log("Barcode:", barcode); 
    console.log("Requesting URL:", url); 

  try {
    const response = await axios.get(url);

    // Check for a successful response (status code 200)
    if (response.status === 200) {
        // Check if the product was found (Open Food Facts returns status 0 if not found)
        const productData = response.data.product;
        console.log(productData)

        res.json(productData)





        /*
        //making call to gemini api
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        //prompt given to model through api
        const prompt = `Explain how I can recycle this product ${productData["product_name"]}`;
        
        const result = await model.generateContent(prompt);
        const llm_response = await result.response;
        res.send(llm_response.text())*/
    
       

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


app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
# EcoScan Web App

# Overview
The name of our project is Eco Scan it is a webapp that shows users how to responsibly dispose of a food products packaging using the products barcode. The web app uses a front end done in javascript that allows users to manually enter the barcode, after which a python HTTP-webserver, comprising the backend of our webapp, recieves the barcode entry sent by the user and makes an api request using OpenFoodFacts API to get packaging information. From there the python webserver utilizes googles gemini LLM via an api call to prompt Gemini for instructions on how to recycle the product.


# Technologies:
- **Frontend**: React Native with Expo
- **Backend**: Python HTTP server
- **APIs**:
  - OpenFoodFacts API for product data
  - Google Gemini API for generating recycling instructions





## Setup requirements

- Node.js (v14+)
- Python (v3.8+)
- Expo CLI
- Google Gemini API key

### Backend Setup

1. Install required Python packages:
   ```bash
   pip install google-generativeai
   ```

2. Start the backend server:
   ```bash
   python server.py
   ```


### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```


## Usage

1. Manually enter the barcode number via web interface
2. Read and follow instructions to properly dispose of product packaging


## API Endpoints
Backend server provides two main endpoints:
- `/barcode?barcode={barcode}`: Retrieves product packaging information from OpenFoodProducts Database
- `/explain?barcode={barcode}`: Generates recycling instructions based on given product materials


## Acknowledgements
- OpenFoodFacts: (https://world.openfoodfacts.org/) for providing open access to product data
- OpenFoodFacts API Tutorial: https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/
- Google Generative AI: (https://ai.google.dev/) for powering the recycling instructions
- [Expo](https://expo.dev/) for the React Native development framework
- "How to use Google Gemini API in Python: A Quick Guide!": https://www.youtube.com/watch?v=bCIQ4tWJsTs
- ChatGPT: used for bug resolution and explanation
- Claude: used for bug resolution and explanation
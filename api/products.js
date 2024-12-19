const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Product = require('./models/Product'); // Import your Product model
require('dotenv').config();

const app = express();

// Use middlewares
app.use(cors({
    origin: '*' // Replace '*' with your frontend URL for more security, e.g., 'https://invoice-mdby.vercel.app'
  }));app.use(bodyParser.json());  // Parse JSON requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Product creation route
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, category, varieties } = req.body;
    const newProduct = new Product({ name, price, image, category, varieties });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) { 
    res.status(500).json({ message: 'Failed to create product', error });
  }
});
// Product fetching route
app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();  // Fetch all products
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products', error });
    }
  });
  

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

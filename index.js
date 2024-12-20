const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Product = require('./models/Product'); // Import your Product model
const Order = require('./models/order');

require('dotenv').config();

const app = express();

// Use middlewares
app.use(cors());
app.use(bodyParser.json());  // Parse JSON requests

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

app.post('/api/Orders', async (req, res) => {
  try {
    const { id, products, totalAmount, timestamp } = req.body;

    const newOrder = new Order({ id, products, totalAmount, timestamp });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error });
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
  
  // In your Express server
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

  // In your Express backend (api/products.js)
app.delete('/api/products', async (req, res) => {
  try {
    const { name, price } = req.body;

    // Find and delete the product from MongoDB
    const deletedProduct = await Product.findOneAndDelete({
      name,
      price,
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
});



// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

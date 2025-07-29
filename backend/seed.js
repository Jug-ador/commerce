require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: 'Stylish T-Shirt',
      description: 'A sleek cotton t-shirt in multiple colors.',
      price: 19.99,
      imageUrl: '/images/tshirt.jpg'
    },
    {
      name: 'Running Sneakers',
      description: 'Comfortable and light sneakers for daily runs.',
      price: 49.99,
      imageUrl: '/images/sneakers.jpg'
    }
  ]);
  console.log('Products seeded.');
  mongoose.disconnect();
})
.catch(err => console.error('DB error:', err.message));

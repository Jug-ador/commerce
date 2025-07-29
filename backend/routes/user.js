const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const User = require('../models/user');
const router = express.Router();

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) =>
    cb(null, `avatar_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 2e6 } });

router.get('/profile', auth, (req, res) =>
  res.json({ name: req.user.name, email: req.user.email, avatarUrl: req.user.avatarUrl, cart: req.user.cart })
);

router.post('/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
  req.user.avatarUrl = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json({ avatarUrl: req.user.avatarUrl });
});

router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/cart', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const item = req.user.cart.find(i => i.productId.equals(productId));
  if (item) item.quantity += quantity;
  else req.user.cart.push({ productId, quantity });
  await req.user.save();
  res.json(req.user.cart);
});

router.get('/cart', auth, (req, res) => res.json(req.user.cart));

router.post('/cart/remove', auth, async (req, res) => {
  req.user.cart = req.user.cart.filter(i => !i.productId.equals(req.body.productId));
  await req.user.save();
  res.json(req.user.cart);
});

module.exports = router;

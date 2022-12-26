const asyncHandler = require("express-async-handler");
const { Cart } = require("../models/cartModel");
const { Product } = require("../models/productModel");

const getProductId = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("product not found");
  }
  res.send(product);
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ sold: false });
  res.send(products);
});

const addProduct = asyncHandler(async (req, res) => {
  const seller = req.user.email;
  console.log(seller, "Helllgttt");
  const { name, price, url, sold, category, details, phone } = req.body;
  const prod = await Product.create({
    name,
    price,
    url,
    sold,
    category,
    details,
    phone,
    seller,
  });
  if (!prod) {
    res.status(400);
    throw new Error("Failed to add Product");
  }
  try {
    userCart = await Cart.findOne({ email: req.user.email });
  } catch (error) {
    throw new Error("Internal Error Occured");
  }

  if (!userCart) {
    userCart = await Cart.create({ email: req.user.email });
  }

  if (userCart) {
    try {
      userCart.cart.push({ product: prod });
    } catch (error) {
      throw new Error("Internal Error Occured");
    }
  }

  await userCart.save();
  res.send(userCart);
});

module.exports = { getProductId, getProducts, addProduct };

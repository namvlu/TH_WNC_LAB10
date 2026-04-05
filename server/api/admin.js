const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');
const EmailUtil = require('../utils/EmailUtil');


router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoryDAO.deleteById(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async function (req, res) {
  console.log("BODY:", req.body); // 🔥

  const username = req.body.username;
  const password = req.body.password;

  console.log("CHECK:", username, password); // 🔥

  const admin = await AdminDAO.selectByUsernameAndPassword(username, password);

  console.log("RESULT:", admin); // 🔥

  if (admin) {
    const token = JwtUtil.genToken(username, password);
    res.json({ success: true, message: 'Authentication successful', token: token });
  } else {
    res.json({ success: false, message: 'Incorrect username or password' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

router.get('/products', JwtUtil.checkToken, async function (req, res) {
  let products = await ProductDAO.selectAll();

  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);

  let curPage = 1;
  if (req.query.page)
    curPage = parseInt(req.query.page);

  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);

  const result = {
    products: products,
    noPages: noPages,
    curPage: curPage
  };

  res.json(result);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;

  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);

  const product = {
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const _id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;

  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);

  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const status = req.body.status;

  const result = await OrderDAO.update(_id, status);
  res.json(result);
});
// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
    const customers = await CustomerDAO.selectAll();
    res.json(customers);
});

// order
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
    const _cid = req.params.cid;

    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
});
// customer
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const token = req.body.token;

    const result = await CustomerDAO.active(_id, token, 0);

    res.json(result);
});
// customer
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;

    const cust = await CustomerDAO.selectByID(_id);

    if (cust) {
        const send = await EmailUtil.send(cust.email, cust._id, cust.token);

        if (send) {
            res.json({ success: true, message: 'Please check email' });
        } else {
            res.json({ success: false, message: 'Email failure' });
        }
    } else {
        res.json({ success: false, message: 'Not exists customer' });
    }
});
module.exports = router;
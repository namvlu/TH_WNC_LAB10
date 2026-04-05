const express = require('express');
const router = express.Router();

const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// DAOs
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');

// ================= CATEGORY =================
router.get('/categories', async (req, res) => {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= PRODUCT =================
router.get('/products/new', async (req, res) => {
  try {
    const products = await ProductDAO.selectTopNew(3);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products/hot', async (req, res) => {
  try {
    const products = await ProductDAO.selectTopHot(3);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products/category/:cid', async (req, res) => {
  try {
    const products = await ProductDAO.selectByCatID(req.params.cid);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products/search/:keyword', async (req, res) => {
  try {
    const products = await ProductDAO.selectByKeyword(req.params.keyword);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await ProductDAO.selectByID(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= SIGNUP =================
router.post('/signup', async (req, res) => {
  try {
    const { username, password, name, phone, email } = req.body;

    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

    if (dbCust) {
      return res.json({ success: false, message: 'Exists username or email' });
    }

    const token = CryptoUtil.md5(Date.now().toString());

    const newCust = {
      username,
      password,
      name,
      phone,
      email,
      active: 0,
      token
    };

    const result = await CustomerDAO.insert(newCust);

    if (!result) {
      return res.json({ success: false, message: 'Insert failure' });
    }

    // ⚠️ Gửi email (có thể lỗi)
    try {
      const send = await EmailUtil.send(email, result._id, token);

      if (send) {
        return res.json({ success: true, message: 'Please check email' });
      } else {
        return res.json({ success: false, message: 'Email failure' });
      }
    } catch (emailErr) {
      console.error('Email error:', emailErr);

      // vẫn OK vì đã lưu DB
      return res.json({
        success: true,
        message: 'Signup success but email failed'
      });
    }

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ================= ACTIVE =================
router.post('/active', async (req, res) => {
  try {
    const result = await CustomerDAO.active(req.body.id, req.body.token, 1);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: 'Please input username and password' });
    }

    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

    if (!customer) {
      return res.json({ success: false, message: 'Incorrect username or password' });
    }

    if (customer.active !== 1) {
      return res.json({ success: false, message: 'Account is deactive' });
    }

    const token = JwtUtil.genToken();

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      customer
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= TOKEN =================
router.get('/token', JwtUtil.checkToken, (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is valid', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= PROFILE =================
router.put('/customers/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const customer = {
      _id: req.params.id,
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    };

    const result = await CustomerDAO.update(customer);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= CHECKOUT =================
router.post('/checkout', JwtUtil.checkToken, async (req, res) => {
  try {
    const order = {
      cdate: Date.now(),
      total: req.body.total,
      status: 'PENDING',
      customer: req.body.customer,
      items: req.body.items
    };

    const result = await OrderDAO.insert(order);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= ORDERS =================
router.get('/orders/customer/:cid', JwtUtil.checkToken, async (req, res) => {
  try {
    const orders = await OrderDAO.selectByCustID(req.params.cid);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
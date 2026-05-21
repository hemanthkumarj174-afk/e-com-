const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Product, Order, sequelize } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

// ==========================================
// 1. AUTH CONTROLLER
// ==========================================
const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Default first registered account as admin for easy testing, otherwise default to user
      // or check role input if provided
      let finalRole = role || 'user';
      
      // Safety check: if there are no users in system, make first an admin!
      const userCount = await User.count();
      if (userCount === 0) {
        finalRole = 'admin';
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: finalRole,
      });

      // Generate token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ message: 'Internal server error during registration.' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal server error during login.' });
    }
  },
};

// ==========================================
// 2. PRODUCT CONTROLLER
// ==========================================
const productController = {
  getAllProducts: async (req, res) => {
    try {
      const { category, search, minPrice, maxPrice, sort } = req.query;
      const whereClause = {};

      // Filter by category
      if (category && category !== 'All') {
        whereClause.category = category;
      }

      // Search term
      if (search) {
        whereClause.name = {
          [Op.like]: `%${search}%`,
        };
      }

      // Price filters
      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
      }

      // Sorting
      let order = [['createdAt', 'DESC']]; // default newest
      if (sort === 'priceAsc') {
        order = [['price', 'ASC']];
      } else if (sort === 'priceDesc') {
        order = [['price', 'DESC']];
      } else if (sort === 'nameAsc') {
        order = [['name', 'ASC']];
      }

      const products = await Product.findAll({
        where: whereClause,
        order,
      });

      res.json(products);
    } catch (error) {
      console.error('Fetch Products Error:', error);
      res.status(500).json({ message: 'Error retrieving products.' });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      res.json(product);
    } catch (error) {
      console.error('Fetch Product Error:', error);
      res.status(500).json({ message: 'Error retrieving product.' });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { name, description, price, category, imageUrl, stock } = req.body;

      if (!name || !description || price === undefined || !category) {
        return res.status(400).json({ message: 'Required fields: name, description, price, category.' });
      }

      const product = await Product.create({
        name,
        description,
        price: parseFloat(price),
        category,
        imageUrl: imageUrl || undefined,
        stock: stock !== undefined ? parseInt(stock) : 10,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Create Product Error:', error);
      res.status(500).json({ message: 'Error creating product.' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { name, description, price, category, imageUrl, stock } = req.body;
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      await product.update({
        name: name !== undefined ? name : product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? parseFloat(price) : product.price,
        category: category !== undefined ? category : product.category,
        imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl,
        stock: stock !== undefined ? parseInt(stock) : product.stock,
      });

      res.json(product);
    } catch (error) {
      console.error('Update Product Error:', error);
      res.status(500).json({ message: 'Error updating product.' });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      await product.destroy();
      res.json({ message: 'Product successfully deleted.' });
    } catch (error) {
      console.error('Delete Product Error:', error);
      res.status(500).json({ message: 'Error deleting product.' });
    }
  },
};

// ==========================================
// 3. ORDER CONTROLLER
// ==========================================
const orderController = {
  createOrder: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { items, shippingAddress } = req.body;
      const userId = req.user.id;

      if (!items || !Array.isArray(items) || items.length === 0) {
        await t.rollback();
        return res.status(400).json({ message: 'Order items are required.' });
      }

      if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zip) {
        await t.rollback();
        return res.status(400).json({ message: 'Valid shipping address is required.' });
      }

      let totalAmount = 0;
      const updatedItems = [];

      // Validate products, check stock, and deduct stock
      for (const item of items) {
        const { productId, quantity } = item;

        if (!productId || !quantity || quantity <= 0) {
          await t.rollback();
          return res.status(400).json({ message: 'Invalid product or quantity in order items.' });
        }

        const product = await Product.findByPk(productId, { transaction: t, lock: true });
        if (!product) {
          await t.rollback();
          return res.status(404).json({ message: `Product not found: ID ${productId}` });
        }

        if (product.stock < quantity) {
          await t.rollback();
          return res.status(400).json({ 
            message: `Insufficient stock for '${product.name}'. Available: ${product.stock}, Requested: ${quantity}` 
          });
        }

        // Deduct stock
        product.stock -= quantity;
        await product.save({ transaction: t });

        const itemTotal = parseFloat(product.price) * quantity;
        totalAmount += itemTotal;

        updatedItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
        });
      }

      // Create Order
      const order = await Order.create({
        userId,
        items: updatedItems,
        totalAmount,
        shippingAddress,
        paymentStatus: 'Paid', // Assuming instant payment success
        orderStatus: 'Pending',
      }, { transaction: t });

      await t.commit();
      res.status(201).json(order);
    } catch (error) {
      await t.rollback();
      console.error('Create Order Error:', error);
      res.status(500).json({ message: 'Error processing order.' });
    }
  },

  getOrders: async (req, res) => {
    try {
      const { id, role } = req.user;
      
      let orders;
      if (role === 'admin') {
        // Admins can see all orders with customer details
        orders = await Order.findAll({
          include: [{ model: User, attributes: ['id', 'name', 'email'] }],
          order: [['createdAt', 'DESC']],
        });
      } else {
        // Users can only see their own orders
        orders = await Order.findAll({
          where: { userId: id },
          order: [['createdAt', 'DESC']],
        });
      }

      res.json(orders);
    } catch (error) {
      console.error('Fetch Orders Error:', error);
      res.status(500).json({ message: 'Error retrieving orders.' });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { orderStatus } = req.body;
      const { id } = req.params;

      if (!orderStatus) {
        return res.status(400).json({ message: 'Order status is required.' });
      }

      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: 'Invalid order status value.' });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      await order.update({ orderStatus });

      res.json(order);
    } catch (error) {
      console.error('Update Order Status Error:', error);
      res.status(500).json({ message: 'Error updating order status.' });
    }
  },
};

module.exports = {
  authController,
  productController,
  orderController,
};

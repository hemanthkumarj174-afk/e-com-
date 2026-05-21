const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { sequelize, User, Product, Order } = require('./models');
const { verifyToken, adminOnly } = require('./middleware/auth');
const { authController, productController, orderController } = require('./controllers');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// ROUTING
// ==========================================

// Public Auth Endpoints
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Public Product Catalog Endpoints
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);

// Admin-Only Product CRUD Endpoints
app.post('/api/products', verifyToken, adminOnly, productController.createProduct);
app.put('/api/products/:id', verifyToken, adminOnly, productController.updateProduct);
app.delete('/api/products/:id', verifyToken, adminOnly, productController.deleteProduct);

// Protected Order Placement & Query Endpoints
app.post('/api/orders', verifyToken, orderController.createOrder);
app.get('/api/orders', verifyToken, orderController.getOrders);

// Admin-Only Order Status Override Endpoint
app.patch('/api/orders/:id', verifyToken, adminOnly, orderController.updateOrderStatus);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// ==========================================
// SEEDING FUNCTION
// ==========================================
async function seedDatabase() {
  try {
    // Check if products already exist
    const productCount = await Product.count();
    if (productCount > 0) {
      console.log('Database already has seeded data. Skipping seed.');
      return;
    }

    console.log('Seeding Database...');

    // 1. Seed Users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await User.bulkCreate([
      {
        name: 'Store Administrator',
        email: 'admin@ecom.com',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'Jane Customer',
        email: 'user@ecom.com',
        password: userPassword,
        role: 'user',
      },
    ]);

    console.log('✓ Seeding Users completed.');

    // 2. Seed Products
    await Product.bulkCreate([
      {
        name: 'AeroSound Pro Headphones',
        description: 'Experience pure sonic bliss with high-fidelity audio, advanced active noise cancellation (ANC), memory-foam ear cups, and an outstanding 45-hour wireless battery life.',
        price: 299.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        stock: 12,
      },
      {
        name: 'Nomad Leather Backpack',
        description: 'Handcrafted from premium full-grain vegetable-tanned leather. Features an integrated padded 16-inch laptop sleeve, brass zippers, and expandable side compartments for active explorers.',
        price: 149.00,
        category: 'Apparel',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        stock: 8,
      },
      {
        name: 'Apex Mechanical Keyboard',
        description: 'Engage typing excellence with clicky mechanical switches, customizable per-key RGB backlighting, high-grade aluminum frame, double-shot PBT keycaps, and hot-swappable mounts.',
        price: 189.50,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        stock: 15,
      },
      {
        name: 'Element Insulated Bottle',
        description: 'Double-walled vacuum insulated professional stainless steel water bottle. Keeps your beverage icy cold for 24 hours or steaming hot for 12 hours. Sweat-proof powder-coated matte surface.',
        price: 39.99,
        category: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
        stock: 30,
      },
      {
        name: 'PureGrip Cork Yoga Mat',
        description: 'Eco-friendly, biodegradable yoga mat sourced from natural oak bark cork and recycled TPE. Offers exceptional sweat-resistant grip, natural antimicrobial properties, and supportive joint cushioning.',
        price: 79.00,
        category: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
        stock: 20,
      },
      {
        name: 'Architectural Visions Vol I',
        description: 'A coffee-table masterpiece exploring high-modernist and sustainable structures across seven continents. Filled with premium glossy photographs, conceptual blueprints, and essays from leading designers.',
        price: 45.00,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
        stock: 25,
      },
    ]);

    console.log('✓ Seeding Products completed.');
    console.log('Seeding Database Completed Successfully!');
  } catch (error) {
    console.error('Seeding Database Error:', error);
  }
}

// ==========================================
// STARTUP SERVER & SYNC DB
// ==========================================
async function startServer() {
  try {
    // Sync models to DB (creates tables if they do not exist)
    // In dev we can use { alter: true } or { force: false }
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');
    
    // Seed initial users and products
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  E-Commerce API Server Running on port ${PORT}`);
      console.log(`  Local URL: http://localhost:${PORT}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

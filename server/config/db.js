const { Sequelize } = require('sequelize');
const path = require('path');

/**
 * DATABASE CONFIGURATION (Sequelize ORM)
 * 
 * By default, this application is configured to run with SQLite,
 * storing all e-commerce data in a local file: `./server/database.sqlite`.
 * This requires ZERO system setup and runs perfectly out-of-the-box.
 * 
 * TO SWITCH TO MYSQL OR POSTGRESQL:
 * 1. Install the database driver package:
 *    - For MySQL:     npm install mysql2 --workspace=server
 *    - For Postgres:  npm install pg pg-hstore --workspace=server
 * 
 * 2. Comment out the SQLite section below, uncomment the desired database,
 *    and fill in your connection details (host, user, password, database).
 */

// ==========================================
// 1. DEFAULT: SQLite (No installation needed)
// ==========================================
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false, // Set to console.log to see SQL queries in real-time
});

// ==========================================
// 2. ALTERNATIVE: PostgreSQL (Uncomment to use)
// ==========================================
/*
const sequelize = new Sequelize('ecom_db', 'your_postgres_user', 'your_postgres_password', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
  define: {
    timestamps: true
  }
});
*/

// ==========================================
// 3. ALTERNATIVE: MySQL (Uncomment to use)
// ==========================================
/*
const sequelize = new Sequelize('ecom_db', 'your_mysql_user', 'your_mysql_password', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
  define: {
    timestamps: true
  }
});
*/

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully via ' + sequelize.getDialect().toUpperCase());
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;

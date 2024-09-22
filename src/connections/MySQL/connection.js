const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); // import dotenv
dotenv.config(); // to configure env variables

const pool = mysql.createPool({
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // connectionLimit:process.env.DB_CONNECTIONLIMIT,
host: 'localhost',
user: 'root',
password: 'root',
database: 'db',
connectionLimit: 10,
});
// console.log('Before pool.query');

  
pool.query('SELECT 1')
  .then(() => {
    console.log('Connected to the MySQL server.');
  })
  .catch((err) => {
    console.error('Error connecting to the MySQL server:', err);
  });
  // console.log('after pool.query');
  

module.exports = pool;

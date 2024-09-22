const pool = require('./connection');

async function queryExecution(query, values) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(query, values);
      return [rows];
    } finally {
      connection.release(); 
    }
  }
  
  module.exports = { queryExecution };
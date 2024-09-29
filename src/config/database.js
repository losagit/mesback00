const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10, 
  host: 'localhost', 
  user: 'root', 
  password: 'my@sql54710', 
  database: 'dbmes' 
});

module.exports = pool;
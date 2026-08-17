const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'testing_system'
});

connection.connect((err) => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log('Connected to database');
    }
});

module.exports = connection;
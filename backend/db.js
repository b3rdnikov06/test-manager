const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '17031703',
    database: 'testing_system'
});

connection.connect((err) => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log('Connected to database');
    }
});

module.exports = connection;
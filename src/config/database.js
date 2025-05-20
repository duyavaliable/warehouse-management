const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();
//kết nối đến cơ sở dữ liệu
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME ,
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4'
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database successfully! Connection ID:', connection.threadId);
    connection.release(); 
});

//xu ly khi mat ket noi
db.on('error', (err) => {
    console.error('Database error: ' + err.code);
    
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Connection to database was lost. Pool will automatically try to reconnect.');
    } else if (err.code === 'PROTOCOL_CONNECTION_ERROR') {
        console.log('Database connection error. Pool will automatically handle it.');
    } else if (err.code === 'ECONNRESET') {
        console.log('Connection was reset. Pool will automatically create new connection.');
    }
})

module.exports = db;
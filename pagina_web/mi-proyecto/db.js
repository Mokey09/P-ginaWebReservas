const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'proyectoDAM'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar:', err);
        return;
    }
    console.log('Conectado a MariaDB correctamente ✅');
});

module.exports = connection;
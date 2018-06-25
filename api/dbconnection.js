var mysql = require('mysql');
var connection = mysql.createPool({
    host: 'trial.fcomet.com',
    user: 'phitsanu',
    password: 'X8v1aC5gp6',
    database: 'phitsanu_db'
});
module.exports = connection;
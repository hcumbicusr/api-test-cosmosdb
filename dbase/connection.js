//const monk = require('monk');
const {db_host, db_name, db_username, db_password, db_port, urlpersona, urldrive} = require('../config');
//const db = monk(`${db_username}:${db_password}@${db_host}:${db_port}/${db_name}`,{authSource:'admin'});

const mysql = require('mysql2/promise')
const pool = mysql.createPool({
  host: db_host,
  port: db_port,
  user: db_username,
  password: db_password,
  database: db_name,
  insecureAuth: false,
});

module.exports = pool;
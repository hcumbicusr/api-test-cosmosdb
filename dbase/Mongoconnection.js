const monk = require('monk');
const {mongodb_host, mongodb_name, mongodb_port, mongodb_username, mongodb_password} = require('../config');
let db = null;
if ( mongodb_username && mongodb_password) {
    db = monk(`${mongodb_username}:${mongodb_password}@${mongodb_host}:${mongodb_port}/${mongodb_name}`);
} else {
    db = monk(`${mongodb_host}:${mongodb_port}/${mongodb_name}`);
}

module.exports = db;
const monk = require('monk');
const {mongodb_host, mongodb_name, mongodb_port, mongodb_username, mongodb_password} = require('../config');
let db = null;
if (process.env.EDN_MONGO_REPLICA=='true') {
    console.log("mongo set replica user+pass: ", `mongodb://${mongodb_username}:****@${mongodb_host}/${mongodb_name}?replicaSet=rs0`);
    db = monk(`mongodb://${mongodb_username}:${mongodb_password}@${mongodb_host}/${mongodb_name}`);
} else if ( mongodb_username && mongodb_password) {
    console.log("mongo set user+pass: ", `mongodb://${mongodb_username}:****@${mongodb_host}:${mongodb_port}/${mongodb_name}`);
    db = monk(`mongodb://${mongodb_username}:${mongodb_password}@${mongodb_host}:${mongodb_port}/${mongodb_name}`);
} else {
    console.log("mongo: ", `mongodb://${mongodb_host}:${mongodb_port}/${mongodb_name}`);
    db = monk(`mongodb://${mongodb_host}:${mongodb_port}/${mongodb_name}`);
}

module.exports = db;
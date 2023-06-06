const {MONGO_URI} = require('../config');

const { MongoClient } = require('mongodb');
const client = new MongoClient(MONGO_URI);

(async() => {
    try {
        await client.connect();
    } catch(error) {
        console.error(error);
    }
});

module.exports = client;
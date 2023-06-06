var express = require('express');
var router = express.Router();

const client = require('../dbase/Mongoconnection');

const dbname = "testdb-cosmos";
const collection_testcollection = "testcollection";


router.post('/test/save', async (req, res) => {    
  let i = 0;
  const total = 10;
  let idInsert = null;
  let response = [];
  while(i < total) {
      const data = {name: "test desde nodejs ["+i+"]"};
      try {
          idInsert = await insertCollection(client, data);
          response.push(idInsert);
      } catch (error) {
          // await client.close();
          res.status(500);
          res.json({"success": false, "error": error});
          return;
      }
      i++;
  }
  // await client.close();
  res.json({"success": true, "result": response});
});

router.get('/test/list', async (req, res) => {
  let result = null;
  console.log("asdas");
  try {
      result = await listCollection(client);
  } catch (error) {
      // await client.close();
      res.status(500);
      res.json({"success": false, "error": error});
      return;
  }
  // await client.close();
  res.json({"success": true, "result": result});
});

async function listCollection(client) {
  const collection = await client.db(dbname).collection(collection_testcollection);
  const changes = await collection.find({}).sort({ $natural: -1 })
  const arr = await changes.toArray();
  console.log("result listCollection", arr);
  return arr;
}

async function insertCollection(client, data) {
  const collection = await client.db(dbname).collection(collection_testcollection);
  const result = await collection.insertOne(data);
  console.log(`New listing created with the following id: ${result.insertedId}`);
  return result.insertedId;
}

module.exports = router;

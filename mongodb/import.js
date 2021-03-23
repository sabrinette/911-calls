const {MongoClient} = require('mongodb');
const csv = require('csv-parser');
const fs = require('fs');
const { mainModule } = require('process');

const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = '911-calls'

const insertCalls = async function(db, callback) {
    const collection = db.collection('calls');

    const calls = [];
    fs.createReadStream('../911.csv')
        .pipe(csv())
        .on('data', data => {
            const call = {}; // TODO créer l'objet call à partir de la ligne
            calls.push(call);
        })
        .on('end', () => {
          collection.insertMany(calls, (err, result) => {
            callback(result)
          });
        });
}

MongoClient.connect(MONGO_URL, (err, client) => {
  if (err) {
      console.error(err);
      throw err;
  }
  const db = client.db(DB_NAME);
  insertCalls(db, result => {
      console.log(`${result.insertedCount} actors inserted`);
      client.close();
  });
});

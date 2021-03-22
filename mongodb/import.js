const {MongoClient} = require('mongodb');
const csv = require('csv-parser');
const fs = require('fs');
const { mainModule } = require('process');

const mongoUrl = 'mongodb://localhost:27017/911-calls';

const insertCalls = async function(client, callback) {
    const collection = client.db("911").collection('calls');

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


const main = async () => {
  const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
  await client.connect({useUnifiedTopology: true});
  

  insertCalls(client, result => {
    console.log(`${result.insertedCount} calls inserted`);
    db.close();
  });
};

main();

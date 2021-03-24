//const elasticsearch = require('elasticsearch');
const csv = require('csv-parser');
const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');
const { type } = require('os');

const ELASTIC_SEARCH_URI = 'http://localhost:9200';
const INDEX_NAME = '911-calls';

async function run() {
  const client = new Client({ node: ELASTIC_SEARCH_URI});

  // Drop index if exists
  await client.indices.delete({
    index: INDEX_NAME,
    ignore_unavailable: true
  });

     //  configurer l'index https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html
     client.indices.create({ 
       index: '911-calls', 
       body: 
        {mappings: 
            {properties:
              {location:
                {type :"geo_point" }, 
                date : {type : "date"}
              }
            }
          }
        }, (err, resp) => {
      if (err) console.log(err.message);
  });
  
let calls = [];
  fs.createReadStream('../911.csv')
    .pipe(csv())
    .on('data', data => {
      const call = { 
        "lat":data.lat,
        "lng":data.lng,
        "title1":data.title.slice(0, data.title.indexOf(':')),
        "title2":data.title.slice( data.title.indexOf(':')+1, data.title.length),
        "zip":data.zip,
        "timeStamp":new Date(data.timeStamp),
        "twp":data.twp,
        "addr":data.addr
      };
       // créer l'objet call à partir de la ligne
      calls.push(call);
    })
    .on('end', async () => {
       // insérer les données dans ES en utilisant l'API de bulk https://www.elastic.co/guide/en/elasticsearch/reference/7.x/docs-bulk.html
      client.bulk(createBulkInsertQuery(calls), (err, resp) => {
        if (err) console.trace(err.message);
        else console.log(`Inserted ${resp.body.items.length} calls`);
        client.close();
      });
    });
    
    function createBulkInsertQuery(calls) {
      const body = calls.reduce((acc, call) => {
        const {lat,lng,title,zip,timeStamp,twp,addr } = call;
        acc.push({ index: { _index: INDEX_NAME, _type: '_doc',_id:call.timeStamp } })
        acc.push({lat,lng,title,zip,timeStamp,twp,addr })
        return acc
      }, []);

      return { body };
    }
    
}
run().catch(console.log);
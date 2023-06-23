const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//midle ware
app.use(cors());
app.use(express.json())



//mongo db


const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASSWORD}@cluster0.qj5o1cz.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const serviceCollection = client.db('recap-ema-jhon').collection('products');
    app.get('/products', async (req,res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size) ;
        console.log(page,size);
        
        const query = {};
        const cursor = serviceCollection.find(query);
        const products = await cursor.skip(page*size).limit(size). toArray();
        const count = await serviceCollection.estimatedDocumentCount();
        res.send({count,products});
    });

    app.post('/productsByIds', async (req,res) => {
      const ids = req.body;
      console.log(ids);
      const objectIds = ids.map(id => new ObjectId(id))
      const query ={ _id : {$in : objectIds}};
      const cursor = serviceCollection.find(query);
      const serv = await cursor.toArray();
      res.send(serv);
    })
    
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('this is appa')
});
app.listen(port, () => {
    console.log(`this is port ${port}`); 
})
const express = require('express');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleWare---
app.use(cors());
app.use(express.json());

// -----database conect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e4xul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
async function run() {
  try {
    await client.connect();
    const database = client.db('Tourism');
    const offersCollection = database.collection('Offers');
    const addedOfferCollection = database.collection('addedOffer');
    //   get api
    app.get('/offers', async (req, res) => {
      const result = await offersCollection.find({}).toArray();
      res.send(result);
    });

    //findone

    app.get('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await offersCollection.findOne(query);
      res.send(result);
    });

    app.post('/addedOffer', async (req, res) => {
      const data = req.body;
      const result = await addedOfferCollection.insertOne(data);
      res.send(result);
    });

    // myorder get api
    app.get('/myorder/:email', async (req, res) => {
      const email = req.params.email;
      const result = await addedOfferCollection
        .find({
          email: email,
        })
        .toArray();
      res.send(result);
    });

    // deleted method
    app.delete('/deletemyorder/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await addedOfferCollection.deleteOne(query);
      res.send(result);
    });

    // manage all order--
    app.get('/manageallorder', async (req, res) => {
      const result = await addedOfferCollection.find({}).toArray();
      res.send(result);
    });

    // manage order delete
    app.delete('/deletemanageorder/:id', async (req, res) => {
      const id = req.params.id;
      const query ={_id : id}
      const result = await addedOfferCollection.deleteOne(query);
      res.send(result);
    });

// add offer---
 app.post('/addoffer',async(req,res)=>{
   const result =await offersCollection.insertOne(req.body)
   res.send(result)
 })

// update
app.put('/status/:id',async(req,res)=>{
  const updatedId =req.params.id 
  const filter ={_id: updatedId}
  const result = await addedOfferCollection.updateOne(filter, {
    $set: {
      status:"Approved",
    },
  });
  res.send(result)
})


    // ---------------
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('running tourism server');
});

app.listen(port, () => {
  console.log('Runing Toursim server on port', port);
});


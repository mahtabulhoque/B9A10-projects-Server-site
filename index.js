const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// middleware

app.use (cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fht8xxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const craftCollection = client.db('addCraftItemDB').collection('addCraftItem');
    const userCollection = client.db('addCraftItemDB').collection('user')

    app.get('/addCraftItem', async(req,res) =>{
      const cursor = craftCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    })

// update  

    app.get('/addCraftItem/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query);
      res.send(result);
    })
    

    app.post('/addCraftItem', async(req,res)=>{
      const newItem = req.body;
      console.log(newItem);
      const result = await craftCollection.insertOne(newItem);
      res.send(result);

    })


app.delete('/addCraftItem/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await craftCollection.deleteOne(query);
    if (result.deletedCount > 0) {
      res.status(200).json({ success: true, message: "Item deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



    




// get craft items by email
 app.get('/craft-by-email', async(req, res)=>{
try {
  const userEmail = req.query.user_email; 
  // console.log(userEmail);
  const query = { user_email: userEmail }; 
  const craftItemsByEmail = await craftCollection.find(query).toArray();
  res.json(craftItemsByEmail)
} catch (error) {
  console.error('Error fetching dta', error);
  res.status(500).json({error: 'Internal server error'});
}
 }
 )




    // get single product
    app.get('/addCraftItem/:id', async (req, res) => {
      try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) }
          const itemDetails = await craftCollection.findOne(query);
          console.log(itemDetails);
          res.send({
              success: true,
              message: "Successfully got the data",
              data: itemDetails,
          })
      }
      catch (error) {
          console.log(error.name, error.message);
          res.send({
              success: false,
              error: error.message,
          });
      }

  })


  app.post('/user', async(req, res)=>{
    const user = req.body;
    console.log(user);
    const result = await userCollection.insertOne(user);
    res.send(result)
  })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send('B9A10 assignment is running')
})

app.listen(port, () => {
    console.log(`B9A10 Server is running on port:${port}`);
})

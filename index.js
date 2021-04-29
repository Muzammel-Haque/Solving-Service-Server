const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectID = require("mongodb").ObjectID;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmlpw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('maker'))
app.use(fileUpload())

const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("mobileService").collection("services");
  const serviceCollection = client.db("mobileService").collection("servicing");
  const orderCollection = client.db("mobileService").collection("order");
  const reviewCollection = client.db("mobileService").collection("review");
  const adminCollection = client.db("mobileService").collection("admin");


  app.post("/addService", (req, res) => {
    const newEvent = req.body;
    console.log("event", newEvent);
    serviceCollection.insertOne(newEvent).then((result) => {
      console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  });

  app.get('/service', (req, res) => {
    serviceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

app.get("/services/:_id", (req, res) => {
  serviceCollection
    .find({ _id: ObjectID(req.params._id) })
    .toArray((err, items) => {
      console.log(items);
      res.send(items);
    });
});

app.post("/addOrder", (req, res) => {
  const newEvent = req.body;
  console.log("event", newEvent);
  orderCollection.insertOne(newEvent).then((result) => {
    console.log(result.insertedCount)
    res.send(result.insertedCount > 0)
  })
});

app.get('/adminOrder', (req, res) => {
  orderCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})

app.get('/orderList', (req, res) => {
  orderCollection.find({email: req.query.email})
      .toArray((err, documents) => {
          res.send(documents);
      })
})

// app.get('/orderList', (req, res) => {
//   console.log(req.headers.authorization)
//   const bearer = req.headers.authorization
//   if(bearer && bearer.startsWith('bearer: ')){
//     const idToken = bearer.split(' ')[1]

//     admin
//   .auth().verifyIdToken(idToken)
//   .then((decodedToken) => {
//     const tokenEmail = decodedToken.email;
//     console.log('token', tokenEmail)
//     if(tokenEmail === req.query.email){
//       orderCollection.find({email: req.query.email})
//       .toArray((err, documents) => {
//           res.send(documents);
//       })
//     }
//     // ...
//   })
//   .catch((error) => {
//     // Handle error
//   });
//   }

  
// })

app.post("/review", (req, res) => {
  const newEvent = req.body;
  console.log("event", newEvent);
  reviewCollection.insertOne(newEvent).then((result) => {
    console.log(result.insertedCount)
    res.send(result.insertedCount > 0)
  })
});

app.get('/review', (req, res) => {
  reviewCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})

app.post("/addAdmin", (req, res) => {
  const newEvent = req.body;
  console.log("event", newEvent);
  adminCollection.insertOne(newEvent).then((result) => {
    console.log(result.insertedCount)
    res.send(result.insertedCount > 0)
  })
});

app.get('/allAdmin', (req, res) => {
  adminCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})

app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  adminCollection.find({ email: email })
      .toArray((err, doctors) => {
          res.send(doctors.length > 0);
      })
})

app.delete("/remove/:id", (req, res)=>{
  console.log(req.params.id)
  serviceCollection.deleteOne({_id: ObjectID(req.params.id)})
  .then(result =>{
  console.log(result)
})
})

app.delete("/orderRemove/:id", (req, res)=>{
  console.log(req.params.id)
  orderCollection.deleteOne({_id: ObjectID(req.params.id)})
  .then(result =>{
  console.log(result)
})
})

app.get('/orderUpdate/:id', (req, res) => {
  orderCollection.find({_id: ObjectID(req.params.id)})
      .toArray((err, documents) => {
          res.send(documents[0]);
      })
})

app.patch('/updatedProduct/:id', (req, res) => {
  console.log(req.body)
  orderCollection.updateOne({_id: ObjectID(req.params.id)},
  {
    $set: {status: req.body.status}
  })
  .then(result =>{
    console.log(result)
  })
})


});


app.listen(process.env.PORT || port)
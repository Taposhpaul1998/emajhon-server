const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express(); 
//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imkfm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run (){
    try{
        await client.connect();
        const productsCollection = client.db('emaJhon').collection('product');

        app.get('/product', async(req,res)=>{
            console.log('query',req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor= productsCollection.find(query);
            let products;
            if(page || size){
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{

            }
            res.send(products);
        });

        app.get('/productCount', async(req,res)=>{
            const count = await productsCollection.estimatedDocumentCount();
            res.send({count})
        })

        // use post to get products
        app.post('/productsByKeys', async (req,res)=>{
            const keys = req.body;
            const ids = keys.map(id=> ObjectId(id))
            const query = {_id:{$in:ids}}
            const cursor = productsCollection.find(query)
            const products = await cursor.toArray();
            res.send(products);
         })
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Jhone is running and waiting in ema');
});

app.listen(port,()=>{
    console.log('port is',port);
})
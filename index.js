require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
var ObjectId = require('mongodb').ObjectId

// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kkoxxt5.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const userData = client.db('usercolletion').collection('alluser');
        const allmedia = client.db('usercolletion').collection('allmedia');
        const comments = client.db('usercolletion').collection('comments');

        app.get('/allusers', async (req, res) => {
            const query = {};
            const options = await userData.find(query).toArray();
            res.send(options)
            console.log('options')

        })

        app.post('/allusers', async (req, res) => {
            const item = req.body
            console.log(item)
            const result = await userData.insertOne(item)
            res.send(result)
        })

        app.get('/updates/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const options = await userData.findOne(query);
            res.send(options)

        })

        app.put('/updates/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const user = req.body
            const option = { upsert: true }


            const updatedUser = {
                $set: {
                    name: user.name,
                    password: user.password

                }
            }
            const result = await userData.updateOne(filter, updatedUser, option)

            res.send(result)

        })

        app.get('/allmedia', async (req, res) => {
            const query = {};
            const options = await allmedia.find(query).toArray();
            res.send(options)

        })


        //adding post
        app.post('/allmedia', async (req, res) => {
            const item = req.body
            console.log(item)
            const result = await allmedia.insertOne(item)
            res.send(result)
        })


        //comments
        app.post('/comments', async (req, res) => {
            const item = req.body
            console.log(item)
            const result = await comments.insertOne(item)
            res.send(result)
        })




        app.get('/comments', async (req, res) => {
            const query = {};
            const options = await comments.find(query).toArray();
            res.send(options)

        })
        app.get('/allmedia/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }

            const options = await allmedia.findOne(query);
            res.send(options)

        })


        app.put('/allmedia/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const user = req.body;
            const option = { upsert: true }

            const updateUser = {
                $set: {
                    likes: user.count
                }
            }
            const result = await comments.allmedia(filter, updateUser, option)
        })


    }



    finally {

    }
}

run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('database running')
})

app.listen(port, () => {
    console.log(`database is running on port ${port}`)
})
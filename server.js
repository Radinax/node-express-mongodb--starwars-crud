const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

const connectionString = 'mongodb+srv://adrianadmin:adrianadmin@cluster0-7rpdc.mongodb.net/test?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to DB')
    const db = client.db('starwars')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')
    app.get('/', (req, res) => {
      // res.sendFile(__dirname + '/index.html')
      db.collection('quotes').find().toArray()
        .then(results => {      
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
    })
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => res.redirect('/'))
        .catch(error => console.error(error))
    })
    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        // query
        {name: 'Adrian'},
        // update
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        // options
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })
    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        // query
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Removed quote')
        })
        .catch(error => console.error(error))
    })
  })
  .catch(error => console.error(error))

// urlencoded tells body-parser to extract data from form
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())

// To perform GET
/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
*/

app.listen(3000, () => console.log('listening on 3000'))
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = 4000
const mailRouters = express.Router()

let MailNumbers = require('./mailnumbersModel')

app.use(cors())
app.use(bodyParser.json())
app.use('/', mailRouters)

mongoose.connect('mongodb://127.0.0.1:27017/mailnumbers', { useNewUrlParser: true })
const connection = mongoose.connection

connection.once('open', function() {
  console.log('MongoDB connection successfully')
})

app.listen(PORT, function() {
  console.log('Server running on port '+PORT)
})

mailRouters.route('/').post(function(req, res) {
  let mails = new MailNumbers(req.body)
  mails.save()
    .then(todo => {
      res.status(200).json({'mail': 'mail added successfully'})
    })
    .catch(err => {
      res.status(400).send('failed adding mail')
    })
})

mailRouters.route('/list').get(function(req, res) {
  MailNumbers.find(function(err, mails) {
    if (err) {
      console.log(err)
    } else {
      res.json(mails)
    }
  })
})

const mongoose = require('mongoose')

const connection = mongoose.createConnection(process.env.DB || 'mongodb://localhost/timbr')
connection.on('open', ()=>console.log('Mongo connected'))
connection.on('error', err=>{
  console.error(err)
  process.exit(1)
})

const db = {
  user: connection.model('User', require('./user')),
  session: connection.model('Session', require('./session'))
}

module.exports = db;
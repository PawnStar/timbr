const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const db = require('./db')

const app = express()

app.get('/', (req, res, next)=>{
  (async ()=>{

    const results = await db.user.find({})

    res.json(results)

  })().catch(next)
})

app.listen(process.env.PORT || 3000, ()=>console.log('Express server listening'))
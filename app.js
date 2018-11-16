const express = require('express')
const cookieSession = require('cookie-session')
const expressLess = require('express-less')
const db = require('./db')

const app = express()

// Load config
let config = {}
try{ config = require('./config.json') } catch(e){}

// Layout engine
app.set('view engine', 'pug')

// Stylesheets
app.use('/stylesheets', expressLess(__dirname + '/public/stylesheets'));

// Cookies -> Session variable
app.use(cookieSession({
  name: 'timbr-session',
  secret: config.cookieSecret || 'timbrDevSecret',
  maxAge: 12 * 60 * 60 * 1000 // 12 hours
}))

// Look up user from cookie session
app.use(async (req, _, next)=>{
  try{
    // Look up session in database
    const session = await db.session.findOne({_id: req.session._id})

    // Skip invalid sessions
    if(!session || session.end < new Date())
      return next()

    // TODO: Update session end time maybe?

    // Save user object on request
    req.user = await db.user.findOne({_id: session.user})

    // Pass up middleware chain
    return next()
  } catch (e) {
    next(e)
  }
})

// Routes
app.use('/', require('./routes'))
app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
app.use('/social', require('./routes/social'))
app.use('/images', require('./routes/images'))
app.use(express.static('public'))

// Error handler
const err = (message, status)=>{let err = new Error(message); err.status = status || 500; return err}
app.use((_,__,next)=>next(err('Not found', 404)))

app.use((err, req, res, next)=>{
  res.status(err.status || 500)

  if(process.env.NODE_ENV === 'production')
    delete err.stack

  res.render('error', {err, user: req.user})
})

// Start server
const port = process.env.PORT || 3000
app.listen(port, ()=>console.log('Express server listening in port ' + port))

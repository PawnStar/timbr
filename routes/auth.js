const router = require('express-promise-router')();
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

const db = require('../db')

const SALTROUNDS = 10

router.post('/register', bodyParser.urlencoded({extended: true}), async (req, res)=>{
  if(!req.body.name) throw new Error('Name required')
  if(!req.body.email) throw new Error('Email required')
  if(!req.body.password) throw new Error('Password required')

  // Create new user object
  let newUser = new db.user()
  newUser.name = req.body.name
  newUser.email = req.body.email
  newUser.password = await bcrypt.hash(req.body.password, SALTROUNDS)
  await newUser.save()

  // Create new session object
  let newSession = new db.session()
  newSession.start = new Date()
  newSession.end = new Date(Date.now() + 12 * 60 * 60 * 1000)
  newSession.user = newUser
  await newSession.save()

  req.session._id = newSession._id

  res.redirect('/profile/edit')
})

router.post('/login', bodyParser.urlencoded({extended: true}), async (req, res)=>{
  let user = await db.user.findOne({email: req.body.email})

  if(!user)
    throw new Error('Invalid login')

  const correctPassword = await bcrypt.compare(req.body.password, user.password)

  if(!correctPassword)
    throw new Error('Invalid login')
  
  // Create new session object
  let newSession = new db.session()
  newSession.start = new Date()
  newSession.end = new Date(Date.now() + 12 * 60 * 60 * 1000)
  newSession.user = user
  await newSession.save()

  req.session._id = newSession._id

  res.redirect('/profile/messages')
})

router.get('/logout', (_, res)=>{
  // Clear cookie
  res.cookie('timbr-session', '', {
    maxAge: 0
  })

  // Redirect to home
  res.redirect('/')
})

module.exports = router;
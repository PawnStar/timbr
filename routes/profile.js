const router = require('express-promise-router')();
const bodyParser = require('body-parser')

const db = require('../db')

// If you're not logged in, you can't see profiles
router.use((req, res, next)=>{
  if(!req.user)
    return res.render('login', {redirect: req.originalUrl})
  next()
})

router.get('/', (req, res)=>{
  res.render('profile', {user: req.user, profile: req.user})
})

router.get('/edit', (req, res)=>{
  res.render('editProfile', {user: req.user})
})

router.get('/:id', async (req, res)=>{
  const profile = await db.user.findOne({_id: req.params.id})

  if(!profile) return 'next'

  if(profile.blocked.join('-').includes(req.user._id)){
    let err = new Error('Blocked')
    err.status = 401
    err.details = 'You have been blocked from viewing this user\'s profile'
    throw err
  }

  res.render('profile', {user: req.user, profile: profile})
})

router.post('/edit', bodyParser.urlencoded({extended: true}), async (req, res)=>{
  let user = await db.user.findOne({_id: req.user._id})
  if(!user) throw new Error('Invalid login')

  user.email = req.body.email
  user.name = req.body.name
  user.description = req.body.description

  // This one's a bit tricky so watch closely
  user.interests = Object.keys(req.body).filter(f=>f.match('^interest_')).map(f=>req.body[f])

  await user.save()

  res.redirect('/profile')
})

module.exports = router;
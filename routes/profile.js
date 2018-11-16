const router = require('express-promise-router')();

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

module.exports = router;
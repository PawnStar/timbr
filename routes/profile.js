const router = require('express-promise-router')();

const db = require('../db')

router.get('/', (req, res)=>{
  if(!req.user)
    return res.redirect('/login')

  res.render('profile', {user: req.user, profile: req.user})
})

router.get('/edit', (req, res)=>{
  if(!req.user)
    return res.redirect('/login')

  res.render('editProfile', {user: req.user})
})

router.get('/:id', async (req, res)=>{
  const profile = await db.user.findOne({_id: req.params.id})

  if(!profile) return 'next'

  res.render('profile', {user: req.user, profile: profile})
})

module.exports = router;
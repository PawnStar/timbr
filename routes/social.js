const router = require('express-promise-router')();

const db = require('../db')

router.use((req, res, next)=>{
  if(!req.user)
    return res.render('login', {redirect: req.originalUrl})
  next()
})

router.get('/block/:id', async (req, res)=>{
  const user = await db.user.findOne({_id: req.user._id})

  if(user.blocked.indexOf(req.params.id) === -1)
    user.blocked.push(req.params.id)

  await user.save()

  res.redirect('/profile/' + req.params.id)
})

router.get('/unblock/:id', async (req, res)=>{
  const user = await db.user.findOne({_id: req.user._id})

  let blocked = user.blocked.map(i=>i.toString())
  const index = blocked.indexOf(req.params.id)

  if(index !== -1){
    blocked.splice(index, 1)
    user.blocked = blocked;
  }

  await user.save()

  res.redirect('/profile/' + req.params.id)
})

router.get('/message/:id', async (req, res)=>{
  let err = new Error('Feature unavailable')
  err.details = 'We apologize.  This feature is not implemented at this time.'
  throw err;
})

module.exports = router;

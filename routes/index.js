const router = require('express-promise-router')();

router.get('/', (req, res)=>{
  if(req.user)
    return res.redirect('/profile')

  res.render('index')
})

router.get('/login', (req, res)=>{
  if(req.user)
    return res.redirect('/')

  res.render('login')
})

module.exports = router;
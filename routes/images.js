const router = require('express-promise-router')();
const path = require('path')

router.get('/profile/:id', (req, res)=>{
  //TODO: Look up profile picture in DB

  res.sendFile(path.join(__dirname, '../public/images/profile-blank.png'))
})

router.get('/banner/:id', (req, res)=>{
  //TODO: Look up profile picture in DB

  res.sendFile(path.join(__dirname, '../public/images/profile-hero-blank.jpg'))
})

module.exports = router;
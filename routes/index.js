const router = require('express-promise-router')();

const db = require('../db')

router.get('/', async (req, res)=>{
  if(!req.user){
    const recents = await db.user.find().sort({ _id : -1 }).limit(6)
    return res.render('index', {recents})
  }

  const suggestions = await db.user.find({_id: {$ne: req.user._id, $not: {$in: req.user.blocked}}, interests: { $elemMatch: {$in: req.user.interests}}})

  const sortedSuggestions = suggestions.map(profile=>{
    var totalInterests = profile.interests.concat(req.user.interests).filter((v,i,self)=>self.indexOf(v) === i).length
    var matchedInterests = profile.interests.filter(v=>req.user.interests.indexOf(v) >= 0).length
    profile.compatibility = (matchedInterests / totalInterests * 100).toFixed(0)
    if(isNaN(profile.compatibility)) profile.compatibility = 0
    return profile
  }).sort((a,b)=>b.compatibility-a.compatibility)
  
  return res.render('matches', {user: req.user, suggestions: sortedSuggestions})
})

router.get('/login', (req, res)=>{
  if(req.user)
    return res.redirect('/')

  res.render('login')
})

module.exports = router;
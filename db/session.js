const {Schema} = require('mongoose')

const session = new Schema({
  start: Date,
  end: Date,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = session;
const {Schema} = require('mongoose')

const user = new Schema({
  profile: {data: Buffer, contentType: String},
  hero: {data: Buffer, contentType: String},
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  description: String,
  interests: [String],
  blocked: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = user;
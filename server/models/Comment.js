const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  // content for the comment
  content: {
    type: String,
    required: true,
    maxlength: 6000
  },
  // a nested object that refers to the comment model for replying tp comments
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // the profile who's leaving the comment
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  // the post thats associated with the comment
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  // the likes that are associated with the profile(s) that leave them
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  // the dislikes that are associated with the profile(s) that leave them
  dislikes:[{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  // the date the comment was made
  createdAt: {
    type: Date,
    default: Date.now,
}, 
}, { timestamps: true })

const Comment = model('Comment', commentSchema);

module.exports = Comment;
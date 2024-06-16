const { Schema, model } = require('mongoose')

const postSchema = new Schema({
  // title, content of the post
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  // the profile who made the post
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  // the topic whats associated with the post
  topic: [{
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  // the comments associated with the post
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // a profiles ability to favorite a post
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  // a profiles ability to remove a favorite post
  removeFavorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  // adding and removing reactions from post
  reactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  removeReactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Post = model('Post', postSchema);

module.exports = Post;
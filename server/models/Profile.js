const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const profileSchema = new Schema({
  //profile name email and password
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 10
  }, 
  //the profiles posts
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // adding favorites and removing favs from profile
  favorites: [{ 
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }],
  removeFavorites: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }],
  // adding / removing reactions from posts from profile
  reactions: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }],
  removeReactions: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

profileSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

profileSchema.methods.checkPassword = async function(loginPw) {
  return bcrypt.compare(loginPw, this.password);
};

const Profile = model('Profile', profileSchema);

module.exports = Profile;
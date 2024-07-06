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
  // updatePassword: {
  //   type: String,
  //   required: true,
  //   minlength: 10
  // }, 
  bio: {
    type: String,
  },
  socialHandle: {
    type: String
  },
  location: {
    type: String
  },
  //the profiles posts via arrays
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // adding favorites and removing favs from profile
  favoritePost: [{ 
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }],
  reactions: [{
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

profileSchema.methods.isCorrectPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const Profile = model('Profile', profileSchema);

module.exports = Profile;
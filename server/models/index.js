const Profile = require('./Profile')
const Comment = require('./Comment');
const Post = require('./Post')
const Topic = require('./Topic')
const Workout = require('./Workout')
const Exercise = require('./Exercise')

// Exporting out the models
module.exports = { 
    Profile, 
    Post, 
    Comment,
    Topic,
    Workout,
    Exercise
};
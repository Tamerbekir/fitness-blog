const { Profile, Post, Comment, Topic } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    // 'me' within type Query is assigned to the profile which will be the context.user (for auth)
    me: async (parent, args, context) => {
      if (context.user) {
        console.log(context.user)
        return Profile.findOne({ _id: context.user._id }).populate('posts comments reactions removeReactions favorites removeFavorites');
      }
      throw new AuthenticationError('There was an error finding profile.');
    },
    // from type Query, finding all profiles
    profiles: async () => Profile.find({}),
    // from type Query, finding single profile
    profile: async (parent, { _id }) => Profile.findById(_id).populate('posts comments reactions removeReactions favorites removeFavorites'),
    // from type Query, finding all posts
    posts: async () => Post.find({}),
    // from type Query, finding single post
    post: async (parent, { _id }) => Post.findById(_id).populate('profile topic comments reactions removeReactions favorites removeFavorites'),
    // from type Query, finding all topics
    topics: async () => Topic.find({}),
    // from type Query, finding single topics
    topic: async (parent, { _id }) => Topic.findById(_id).populate('posts'),
    // from type Query, finding all comments
    comments: async () => Comment.find({}),
    // from type Query, finding single comment
    comment: async (parent, { _id }) => Comment.findById(_id).populate('profile replies posts likes dislikes')
  },

  // from type Profile and all things associated with the query
  Profile: {
    posts: async (parent) => Post.find({ profile: parent._id }),

    comments: async (parent) => Comment.find({ profile: parent._id }),

    reactions: async (parent) => Post.find({ _id: { $in: parent.reactions } }),

    removeReactions: async (parent) => Post.find({ _id: { $in: parent.removeReactions } }),

    favorites: async (parent) => Post.find({ _id: { $in: parent.favorites } }),

    removeFavorites: async (parent) => Post.find({ _id: { $in: parent.removeFavorites } })
  },

  Post: {
    profile: async (parent) => Profile.findById(parent.profile),

    comments: async (parent) => Comment.find({ post: parent._id }),

    reactions: async (parent) => Profile.find({ _id: { $in: parent.reactions } }),

    removeReactions: async (parent) => Profile.find({ _id: { $in: parent.removeReactions } }),

    favorites: async (parent) => Profile.find({ _id: { $in: parent.favorites } }),

    removeFavorites: async (parent) => Profile.find({ _id: { $in: parent.removeFavorites } }),

    topic: async (parent) => Topic.find({ _id: { $in: parent.topic } })  
  },

  Comment: {
    profile: async (parent) => Profile.findById(parent.profile),

    posts: async (parent) => Post.findById(parent.post),

    replies: async (parent) => Comment.find({ _id: { $in: parent.replies } }),

    likes: async (parent) => Profile.find({ _id: { $in: parent.likes } }),

    dislikes: async (parent) => Profile.find({ _id: { $in: parent.dislikes } })
  },

  Topic: {
    posts: async (parent) => Post.find({ _id: { $in: parent.posts } })
  }
}

module.exports = resolvers;

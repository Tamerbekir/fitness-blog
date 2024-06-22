const { Profile, Post, Comment, Topic } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require('bcrypt');


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

    // removeReactions: async (parent) => Post.find({ _id: { $in: parent.removeReactions } }),

    favorites: async (parent) => Post.find({ _id: { $in: parent.favorites } }),

    removeFavorites: async (parent) => Post.find({ _id: { $in: parent.removeFavorites } })
  },

  Post: {
    profile: async (parent) => Profile.findById(parent.profile),

    comments: async (parent) => Comment.find({ post: parent._id }),

    reactions: async (parent) => Profile.find({ _id: { $in: parent.reactions } }),

    // removeReactions: async (parent) => Profile.find({ _id: { $in: parent.removeReactions } }),

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
  },

  Mutation: {
    addProfile: async (parent, { username, email, password }) => {
      try {

        const profile = await Profile.create({ username, email, password })

        const token = signToken(profile)
        console.log(token)

        return { token, profile }

      } catch (error) {
        if (error) {
          throw new AuthenticationError('Error creating profile')
        }
      }
      throw new AuthenticationError('Sorry, there seems to be a problem making a new profile')
    },


  login: async (parent, { email, password }) => {
    try {
      const profile = await Profile.findOne({ email })

      if(!profile) {
        throw new AuthenticationError('No profile found with this email address.')
      }
  
      const correctPw = await profile.isCorrectPassword(password)

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password or email')
      }
      
      const token = signToken(profile)

      return { token, profile }

    } catch (error) {
      console.error('There was a problem logging in', error)
      throw new AuthenticationError()
    }
  },

  // updating profile mutation
  // taking in their username, email and their password
  updateProfile: async (parent, { username, email, password }, context) => {
    // using context.user for verification
    if (context.user) {
      try {
        // creating a variable that takes in a username and email
        // const updateData = { username, email }

        if (password) {
          // when the user changes their password, the new password will become hashed using bcrypt
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          // updateData.password = hashedPassword
        }

        const updatedProfile = await Profile.findByIdAndUpdate(
          context.user._id, 
          { $set: { username, email } },
          { new: true, runValidators: true }
        ).populate('posts comments reactions removeReactions favorites removeFavorites');

        if (!updatedProfile) {
          throw new AuthenticationError('No profile found.')
        }

        return updatedProfile;

      } catch (error) {
        console.error('Issue updating profile', error)
        throw new AuthenticationError('Issue updating profile')
      }
    } else {
      throw new AuthenticationError('Not authenticated');
    }
  },

  // from removeProfile mutation, taking in id and the context of the user who's logged in
  removeProfile: async (parent, { _id }, context) => {
    if (context.user) {
      try {
        // finding the profile by their id and deleting it
        const removeProfile = await Profile.findByIdAndDelete(_id)

        if(!removeProfile) {
          throw error ('No profile found.')
        }

        return removeProfile
      } catch (error) {
        console.error('Issue deleting profile', error)
        throw new AuthenticationError('Auth issue deleting profile')
      }
    }
    throw new AuthenticationError()
  },

  // taking in addPost mutations
  addPost: async (parent, { title, topic, content }, context) => {
    if (context.user) {
      // because where are preassigned topics, we use the type Topic query and use the topicName as the topic and look that up 
      const topicChoice = await Topic.findOne({ topicName: topic })

      if(!topicChoice) {
        throw new Error('No topic found')
      }

      // when creating a new post
      const newPost = await Post.create({ 
        // profile is going to the be context.user (who is looked in)and the _id is ensuring the post is assigned to said user
        profile: context.user._id,
        // a new post requires a title, content and the topic (topic will have an ID because it is preassigned from an array, not made by the user)
        title,
        content,
        topic: topicChoice._id,
        // adding a date to when the post is made
        createdAt: new Date()
      })

      // finding the profile who is creating this post by their id and updating the profile. 
      await Profile.findByIdAndUpdate(
        // looking user up by the context.user (whos logged in)
        context.user._id,
        // adding the post, specifically the new posts ID which was just made and adding it to the profile
        { $addToSet: { posts: newPost._id  } },
        // running validations 
        { new: true, runValidators: true }
      )
      // returning the new post and updating the profile and topic
      return Post.findById(newPost._id).populate('profile topic')
    }
    throw new AuthenticationError
  },

  //updating post mutation
  updatePost: async (parent, { _id, title, content, topic }, context) => {
    if (context.user) {
      try {
        // looking up a topic and defining topicChoice
        const topicChoice = await Topic.findOne(
          { topicName: topic })

          if(!topicChoice) {
            throw new Error('Topic not found.')
          }

        // looking for a post by its _id and updating it
        const updatePost = await Post.findByIdAndUpdate(
          // going off the posts id
          _id,
          // setting new title, content and the topic, which is the id of the topic we found and defined above
          { $set: { title, content, topic: topicChoice._id } },
          { new: true, runValidators: true }
          //populate everything via post
        ).populate('title content profile topic comments reactions removeReactions favorites removeFavorites')

        return updatePost

      } catch (error) {
        console.error('there was an issue editing this post', error)
        throw new AuthenticationError('There was an issue editing this post.')
      }
    }
  },

  removePost: async (parent, { _id }, context) => {
    if (context.user) {
      try {
        const removePost = await Post.findByIdAndDelete(_id)

        if (!removePost) {
          console.error('there was a problem finding post to delete', error)
        }

        return removePost

      } catch (error) {
        throw new AuthenticationError('There was a problem removing post.')
      }
    }
  },

  // adding a reaction mutation
  // using postId and profileId which is used to identify a specific profile and post via mutation
  addReactionPost: async (parent, { postId }, context) => {
    if (context.user) {
      try {
        // finding the post by its ID and adding the reaction going off the of the context user's id
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $addToSet: { reactions: context.user._id } },
          { new: true, runValidators: true }
        ).populate('profile reactions');

        // finding the profile and fetching data and updating it
        // going off context.user, add the reaction to their profile. 
        // this means the user can only add ONE reaction per post. 
        await Profile.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { reactions: postId } },
          { new: true, runValidators: true }
        );

        return updatedPost;
      } catch (error) {
        console.error('There was an error adding a reaction to the post:', error)
        throw new AuthenticationError('There was an error adding a reaction to the post.')
      }
    }
    throw new AuthenticationError('You must be logged in to react to a post.');
  },

  // same logic as adding reaction but in this case we are pulling the reaction the profile added
  // using $pull instead of $onset because I want to leave array empty if there are no reactions. Onset would remove it completely
  removeReactionPost: async (parent, { postId }, context) => {
    if (context.user) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $pull: { reactions: context.user._id } },
          { new: true, runValidators: true }
        ).populate('profile reactions')

        await Profile.findByIdAndUpdate(
          context.user._id,
          { $pull: { reactions: postId } },
          { new: true, runValidators: true }
        );

        return updatedPost;
      } catch (error) {
        console.error('There was an error removing the reaction from the post:', error);
        throw new AuthenticationError('There was an error removing the reaction from the post.')
      }
    }
    throw new AuthenticationError('You must be logged in to remove a reaction from a post.');
  },



  }
}

module.exports = resolvers;



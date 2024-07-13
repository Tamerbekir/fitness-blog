const { Profile, Post, Comment, Topic, Workout, Exercise } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require('bcrypt');


const resolvers = {
  Query: {
    // 'me' within type Query is assigned to the profile which will be the context.user (for auth)
    me: async (parent, args, context) => {
      if (context.user) {
        console.log(context.user)
        return Profile.findOne({ _id: context.user._id }).populate('posts comments reactions favoritePost');
      }
      throw new AuthenticationError('There was an error finding profile.');
    },
    // from type Query, finding all profiles
    profiles: async () => Profile.find({}),
    // from type Query, finding single profile
    profile: async (parent, { _id }) => Profile.findById(_id).populate('posts comments reactions favoritePost'),
    // from type Query, finding all posts and their associations
    posts: async () => Post.find({}).populate('profile topic comments reactions favoritePost'),
    // from type Query, finding single post
    post: async (parent, { _id }) => Post.findById(_id).populate('profile topic comments reactions removeReactions favoritePost'),

    //finding workouts and populating the profile associated with them 
    workouts: async () => Workout.find({}).populate(),

    //finding a workout by its ID and populating the profile it is associated with it
    workout: async (parent, { _id }) => Workout.findById(_id).populate('profile'),

    exercises: async () => Exercise.find({}),

    exercise: async (parent, { _id }) => Exercise.findById(_id).populate('workouts'),

    // from type Query, finding all topics
    topics: async () => Topic.find({}),
    // from type Query, finding single topics
    topic: async (parent, { _id }) => Topic.findById(_id).populate('posts'),
    // from type Query, finding all comments
    comments: async () => Comment.find({}),
    // from type Query, finding single comment
    comment: async (parent, { _id }) => Comment.findById(_id).populate('profile commentReplies posts likes dislikes')
  },

  // from type Profile and all things associated with the query
  Profile: {
    posts: async (parent) => Post.find({ profile: parent._id }),

    comments: async (parent) => Comment.find({ profile: parent._id }),

    reactions: async (parent) => Post.find({ _id: { $in: parent.reactions } }),

    favoritePost: async (parent) => Post.find({ _id: { $in: parent.favoritePost } }),

    //finding the workouts found in the profile by
    workouts: async (parent) => Workout.find({ _id: { $in: parent.workouts } })
  },

  Post: {
    profile: async (parent) => Profile.findById(parent.profile),

    comments: async (parent) => Comment.find({ post: parent._id }),

    reactions: async (parent) => Profile.find({ _id: { $in: parent.reactions } }),

    favoritePost: async (parent) => Profile.find({ _id: { $in: parent.favoritePost } }),

    topic: async (parent) => Topic.find({ _id: { $in: parent.topic } })
  },

  Workout: {
    profile: async (parent) => Profile.findById(parent.profile),

    exercise: async (parent) => Exercise.find({ _id: { $in: parent.exercise } })
  },

  Comment: {
    profile: async (parent) => Profile.findById(parent.profile),

    posts: async (parent) => Post.findById(parent.post),

    commentReplies: async (parent) => Comment.find({ _id: { $in: parent.commentReplies } }),

    likes: async (parent) => Profile.find({ _id: { $in: parent.likes } }),

    dislikes: async (parent) => Profile.find({ _id: { $in: parent.dislikes } })
  },

  Exercise: {
    workouts: async (parent) => Workout.find({ _id: { $in: parent.workouts } })
  },

  Topic: {
    posts: async (parent) => Post.find({ _id: { $in: parent.posts } })
  },

  Mutation: {
    addProfile: async (parent, { username, email, password, bio, socialHandle, location }) => {
      try {

        const profile = await Profile.create({ username, email, password, bio, socialHandle, location })

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
      const profile = await Profile.findOne({ email });

      if (!profile) {
        throw new AuthenticationError('Incorrect password or email');
      }

      const correctPassword = await bcrypt.compare(password, profile.password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect password or email');
      }

      const token = signToken(profile);
      return { token, profile };
    },


    // updating profile mutation
    // taking in their username, email and their password
    updateProfile: async (parent, { username, email, password, bio, socialHandle, location }, context) => {
      // using context.user for verification
      if (context.user) {
        try {
          // creating a variable that takes in a username and email along with other variables for user
          const updateData = { username, email, bio, socialHandle, location }
          // console.log(updatedData)

          if (password) {
            // when the user changes their password, the new password will become hashed using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            //users info to be passed through along with password variable to be hashed separately 
            updateData.password = hashedPassword
          }

          const updatedProfile = await Profile.findByIdAndUpdate(
            context.user._id,
            //using variable with users info to be updated
            { $set: updateData },
            { new: true, runValidators: true }
            //populating all things associated with profile model
          ).populate('posts comments reactions favoritePost');

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

          if (!removeProfile) {
            throw error('No profile found.')
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
      try {
      if (context.user) {
        // because where are preassigned topics, we use the type Topic query and use the topicName as the topic and look that up 
        const topicChoice = await Topic.findOne({ topicName: topic })

        if (!topicChoice) {
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
          { $addToSet: { posts: newPost._id } },
          // running validations 
          { new: true, runValidators: true }
        )
        // returning the new post and updating the profile and topic
        return Post.findById(newPost._id).populate('profile topic')
      }

      } catch (error) {
        console.error('error')
        throw new AuthenticationError
      }
  },

    addWorkout: async (parent, { exercise, weight, reps }, context) => {
      try {
        if (context.user) {

          const exerciseChoice = await Exercise.findOne({ exerciseName: exercise })

          if (!exerciseChoice) {
            throw new Error('No Exercise found')
          }

          const newWorkout = await Workout.create({
            profile: context.user._id,
            exercise: exerciseChoice._id,
            weight,
            reps,
            createdAt: new Date()
          })

          await Profile.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { workouts: newWorkout._id } },
            { new: true, runValidators: true }
          )

          return Workout.findById(newWorkout._id).populate('profile exercise')
        }
      } catch (error) {
        console.error('There was an error creating workout', error)
        throw new AuthenticationError('There was an error creating workout', error)
      }
    },

    updateWorkout: async (parent, { _id, exercise, reps, weight }, context) => {
      try {
        if (context.user) {
          // variable for finding an exercise
          const exerciseChoice = await Exercise.findOne(
            // from the typeDefs Exercise Type, we say the exerciseName as a string will be the exercise found in the updateWorkout mutation
            { exerciseName: exercise })

          if (!exerciseChoice) {
            throw new Error('Exercise cannot be found')
          }

          //finding the workout by its id, using set (becasue we arent adding, just setting) the exercise ID, weight and reps
          const updateWorkout = await Workout.findByIdAndUpdate(
            _id,
            { $set: { exercise: exerciseChoice._id, weight, reps } },
            { new: true, runValidators: true }
          ).populate('profile exercise')


          return updateWorkout
        }
      } catch (error) {
        console.error('there was an error updating workout ->', error)
        throw new AuthenticationError('there was an error updating workout ')
      }
    },

    //remove workout mutation
    removeWorkout: async (parent, { _id }, context) => {
      try {
        if (context.user) {
          //find the workout by its id
          const removeWorkout = await Workout.findByIdAndDelete(_id)

          if (!removeWorkout) {
            console.error('cannot locate workout to delete', error)
          }

          //find the profile by its id and update the workout associated with it
          //removeWorkout mutation with profile
          // pull the variable workouts from the profile model by its id
          await Profile.findByIdAndUpdate(
            removeWorkout.profile,
            { $pull: { workouts: _id } },
            { new: true, runValidators: true }
          )

          return removeWorkout

        }
      } catch (error) {
        console.error('Error deleting workout', error)
        throw new AuthenticationError('Error deleting workout')
      }
    },

    //updating post mutation
    updatePost: async (parent, { _id, title, content, topic }, context) => {
      if (context.user) {
        try {
          // looking up a topic and defining topicChoice
          const topicChoice = await Topic.findOne(
            { topicName: topic })

          if (!topicChoice) {
            throw new Error('Topic not found.')
          }

          // looking for a post by its _id and updating it
          const updatePost = await Post.findByIdAndUpdate(
            // going off the posts id
            // setting new title, content and the topic, which is the id of the topic we found and defined above
            _id,
            { $set: { title, content, topic: topicChoice._id } },
            { new: true, runValidators: true }
            //populate everything via post
          ).populate('title content profile topic comments reactions favoritePost')

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

          await Profile.findByIdAndUpdate(
            removePost.profile,
            { $pull: { posts: _id } },
            { new: true, runValidators: true }
          )

          return removePost

        } catch (error) {
          throw new AuthenticationError('There was a problem removing post.')
        }
      }
    },

    // adding a reaction mutation
    // using postId and profileId which is used to identify a specific profile and post via mutation
    addOrRemoveReactionPost: async (parent, { postId }, context) => {
      if (context.user) {
        try {
          // finding the post by its ID and adding the reaction going off the of the context user's id

          const post = await Post.findById(
            postId
          )

          const hasReaction = post.reactions.includes(context.user._id)

          if (hasReaction) {
            await Post.findByIdAndUpdate(
              postId,
              { $pull: { reactions: context.user._id } },
              { new: true, runValidators: true }
            ).populate('profile reactions')

            await Profile.findByIdAndUpdate(
              context.user._id,
              { $pull: { reactions: postId } },
              { new: true, runValidators: true }
            )

          } else {
            await Post.findByIdAndUpdate(
              postId,
              { $addToSet: { reactions: context.user._id } },
              { new: true, runValidators: true }
            )

            // finding the profile and fetching data and updating it
            // going off context.user, add the reaction to their profile. 
            // this means the user can only add ONE reaction per post. 
            await Profile.findByIdAndUpdate(
              context.user._id,
              //addToSet only allows one to be pushed into the array and avoids duplicates
              { $addToSet: { reactions: postId } },
              { new: true, runValidators: true }
            )
          }

          return Post.findById(postId).populate('profile reactions')

        } catch (error) {
          console.error('There was an error adding a reaction to the post:', error)
          throw new AuthenticationError('There was an error adding a reaction to the post.')
        }
      }
      throw new AuthenticationError('You must be logged in to react to a post.');
    },

    //! removing logic because I created just mutation that handles both logics 'addOrRemoveReactions'. Confirmed working. Will retain for now 
    // same logic as adding reaction but in this case we are pulling the reaction the profile added
    // using $pull instead of $onset because I want to leave array empty if there are no reactions. Onset would remove it completely
    // removeReactionPost: async (parent, { postId }, context) => {
    //   if (context.user) {
    //     try {
    //       const removeReactionPost = await Post.findByIdAndUpdate(
    //         postId,
    //         { $pull: { reactions: context.user._id } },
    //         { new: true, runValidators: true }
    //       ).populate('profile reactions')

    //       await Profile.findByIdAndUpdate(
    //         context.user._id,
    //         { $pull: { reactions: postId } },
    //         { new: true, runValidators: true }
    //       );

    //       return removeReactionPost;
    //     } catch (error) {
    //       console.error('There was an error removing the reaction from the post:', error);
    //       throw new AuthenticationError('There was an error removing the reaction from the post.')
    //     }
    //   }
    //   throw new AuthenticationError('You must be logged in to remove a reaction from a post.');
    // },

    // going off the addComment mutation, taking in postId and content as an argument
    addComment: async (parent, { postId, content }, context) => {
      if (context.user) {
        try {
          // creating a comment and passing in the content, profile(context.user) and the post it is on, and defining it as the postId. This way the new comment is attached to these three things
          const addComment = await Comment.create({
            content,
            profile: context.user._id,
            post: postId
          })

          if (!addComment) {
            console.error('there was an issue creating you comment', error.message)
          }

          // finding the post by its id and pushing the argument for comments from the Post query via typeDefs and letting that comment be the addedComment along with its new Id
          //using $push method because it allows us to keep pushing elements into the array, even if they are duplicates
          await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: addComment._id } },
            { new: true, runValidators: true }
          )

          // finding the profile by its id and pushing the argument for comments from the Profile query via typeDefs and letting that comment be the addedComment along with its new Id
          await Profile.findByIdAndUpdate(
            context.user._id,
            { $push: { comments: addComment._id } },
            { new: true, runValidators: true }
          )

          return addComment

        } catch (error) {
          console.error('There was an error adding your comment', error.message)
          throw new AuthenticationError('There was an error adding your comment')
        }
      }
      throw new AuthenticationError('You need to be logged in to add a comment')
    },

    // updating comment mutation
    updateComment: async (parent, { commentId, content }, context) => {
      if (context.user) {
        try {
          // finding comment by its id and using it to update the comment
          // adding #set method to edit content
          // populating all things associated with the comment model
          const updateComment = await Comment.findByIdAndUpdate(
            commentId,
            { $set: { content } },
            { new: true, runValidators: true }
          ).populate('content commentReplies profile post likes dislikes')

          return updateComment

        } catch (error) {
          console.error('There was an error updating your comment', error.message)
        }
      }
      throw new AuthenticationError('There was an error updating your comment')
    },

    // adding remove comment mutation
    removeComment: async (parent, { _id }, context) => {
      if (context.user) {
        try {
          // finding comment by its id
          const removeComment = await Comment.findByIdAndDelete(
            _id
          )

          if (!removeComment) {
            console.error('That comment was not found', error.message)
          }
          // finding the post its under by its id and removing it from the post / updating the post to reflect the new changes
          // 'comments' from the post schema associated with Comment model
          await Post.findByIdAndUpdate(
            removeComment.post,
            { $pull: { comments: _id } },
            { new: true, runValidators: true }
          )
          // finding the profile its under by its id and removing it from the post / updating the profile to reflect the new changes.
          // 'comments' from the profile schema associated with Comment model
          await Profile.findByIdAndUpdate(
            removeComment.profile,
            { $pull: { comments: _id } },
            { new: true, runValidators: true }
          )

          return removeComment

        } catch (error) {
          console.error('There was an error removing your comment', error.message)
          throw new AuthenticationError('There was an error removing your comment')
        }
      }
      throw new AuthenticationError('You need to be logged in to remove a comment');
    },

    // adding a reply to a comment mutation
    // adding in the commentId from the main comment and the content for the comment reply
    replyToComment: async (parent, { commentId, content }, context) => {
      if (context.user) {
        try {
          // console.log('creating reply..')
          // creating a comment using content from parameter, 
          // associating it with the context.user for profile from Comment model
          // associating the comment id with the post from from Comment model
          const replyToComment = await Comment.create({
            content,
            profile: context.user._id,
            post: commentId,
          })

          console.log(replyToComment)

          if (!replyToComment) {
            console.error('There was an issue replying to this comment', error.message)
          }

          // finding the main comment and updating it by pushing new comment into the replies array, which is from the replyToComment id defined above,
          // populating everything from comment model
          await Comment.findByIdAndUpdate(
            commentId,
            { $push: { commentReplies: replyToComment._id } },
            { new: true, runValidators: true }
          ).populate('content commentReplies profile post likes dislikes')

          return replyToComment

        } catch (error) {
          console.error('There was an error replying to this comment', error.message)
          throw new AuthenticationError('There was an error replying to this comment')
        }
      }
    },

    // removing reply to the main comment
    removeReplyToComment: async (parent, { commentId, replyId }, context) => {
      if (context.user) {
        try {
          // looking the replied comment up by its id 
          const removeReplyToComment = await Comment.findByIdAndDelete(
            replyId
          )

          if (!removeReplyToComment) {
            console.error('There was an error removing the reply to this comment', error.message)
          }

          // updating associated Comment model by looking up the main comment's id
          // pulling it from the replies array by going off the reply id above
          await Comment.findByIdAndUpdate(
            commentId,
            { $pull: { commentReplies: replyId } },
            { new: true, runValidators: true }
          )

          return removeReplyToComment

        } catch (error) {
          console.error('There was an error removing the reply to this comment', error.message)
          throw new AuthenticationError('There was an error removing the reply to this comment')
        }
      }
    },

    // adding like comment mutation 
    // this mutation will be used to register a SINGLE response from the user.
    // Using a thumbs up and thumbs down via front end the user can like a comment, which will register.
    // if a user dislikes a comment, their like will be pulled and a dislike (thumbs down) will register instead.
    // the user is allowed limited to one like or one dislike, it cannot be both.
    // using update and $pull because we do not want to delete the likes or dislikes array
    // in this case it is removing dislikes and adding likes
    likeComment: async (parent, { commentId }, context) => {
      if (context.user) {
        try {
          // finding the one comment that is going to receive a like by its id
          const comment = await Comment.findById(
            commentId
          )

          if (!comment) {
            throw new Error('No comment found with this id');
          }
          // creating a variable for if the comment has likes by the user id as well as if they have dislikes
          const hasLiked = comment.likes.includes(context.user._id)
          const hasDisliked = comment.dislikes.includes(context.user._id)

          // if the user already disliked the comment
          // pull the dislike from the comment id from the comment model 'dislikes'
          if (hasDisliked) {
            await Comment.findByIdAndUpdate(
              commentId,
              { $pull: { dislikes: context.user._id } },
              { new: true, runValidators: true }
            );

            // pull the dislike from the profile id from the profile model 'dislikes'
            await Profile.findByIdAndUpdate(
              context.user._id,
              { $pull: { dislikes: commentId } },
              { new: true, runValidators: true }
            );
          }

          // if the user has liked the comment already
          // pull the like from the comment id from the comment model 'likes'
          if (hasLiked) {
            await Comment.findByIdAndUpdate(
              commentId,
              { $pull: { likes: context.user._id } },
              { new: true, runValidators: true }
            );

            // pull the like from the profile id from the profile model 'likes'
            await Profile.findByIdAndUpdate(
              context.user._id,
              { $pull: { likes: commentId } },
              { new: true, runValidators: true }
            );
          } else {

            // if the user did NOT like OR dislike a comment yet, we will..
            // add a like to the comment id from the profile model 'likes'
            await Comment.findByIdAndUpdate(
              commentId,
              { $addToSet: { likes: context.user._id } },
              { new: true, runValidators: true }
            );

            // add a like to the profile id from the comment model 'likes'
            await Profile.findByIdAndUpdate(
              context.user._id,
              { $addToSet: { likes: commentId } },
              { new: true, runValidators: true }
            );
          }

          // returning the Comment mode along with the comment idea and populating data. 
          // this is a safety net to ensure all mutations within this code are returned at the end
          return Comment.findById(commentId).populate('profile likes dislikes');

        } catch (error) {
          console.error('There was an error liking this comment', error.message);
          throw new AuthenticationError('There was an error liking this comment');
        }
      }
      throw new AuthenticationError('You must be logged in to like or dislike a comment.');
    },


    // adding mutation for dislikes 
    // same logic as above, except it will be removing likes and adding dislikes
    dislikeComment: async (parent, { commentId }, context) => {
      if (context.user) {
        try {
          const comment = await Comment.findById(
            commentId
          )

          if (!comment) {
            throw new Error('Comment not found.')
          }

          const hasLiked = comment.likes.includes(context.user._id)
          const hasDisliked = comment.dislikes.includes(context.user._id)

          if (hasLiked) {
            await Comment.findByIdAndUpdate(
              commentId,
              { $pull: { likes: context.user._id } },
              { new: true, runValidators: true }
            );

            await Profile.findByIdAndUpdate(
              context.user._id,
              { $pull: { likes: commentId } },
              { new: true, runValidators: true }
            );
          }

          if (hasDisliked) {
            await Comment.findByIdAndUpdate(
              commentId,
              { $pull: { dislikes: context.user._id } },
              { new: true, runValidators: true }
            );

            await Profile.findByIdAndUpdate(
              context.user._id,
              { $pull: { dislikes: commentId } },
              { new: true, runValidators: true }
            );
          } else {
            await Comment.findByIdAndUpdate(
              commentId,
              { $addToSet: { dislikes: context.user._id } },
              { new: true, runValidators: true }
            );

            await Profile.findByIdAndUpdate(
              context.user._id,
              { $addToSet: { dislikes: commentId } },
              { new: true, runValidators: true }
            );
          }

          return Comment.findById(commentId).populate('profile likes dislikes');

        } catch (error) {
          console.error('There was an error disliking this comment', error.message);
          throw new AuthenticationError('There was an error disliking this comment');
        }
      }
      throw new AuthenticationError('You must be logged in to like or dislike a comment.');
    },


    //mutation for adding and removing favorite 
    addOrRemoveFavoritePost: async (parent, { postId }, context) => {
      if (context.user) {
        try {
          const post = await Post.findById(
            postId
          )

          if (!post) {
            throw new Error('No post with this id found')
          }

          const alreadyFavorite = post.favoritePost.includes(context.user._id)
          // const notFavorite = post.removeFavorites.includes(context.user._id)

          if (alreadyFavorite) {
            await Post.findByIdAndUpdate(
              postId,
              { $pull: { favoritePost: context.user._id } },
              { new: true, runValidators: true }
            )

            await Profile.findByIdAndUpdate(
              context.user._id,
              { $pull: { favoritePost: postId } },
              { new: true, runValidators: true }
            )

          } else {

            await Post.findByIdAndUpdate(
              postId,
              { $addToSet: { favoritePost: context.user._id } },
              { new: true, runValidators: true }
            )

            await Profile.findByIdAndUpdate(
              context.user._id,
              { $addToSet: { favoritePost: postId } },
              { new: true, runValidators: true }
            )
          }

          return Post.findById(postId).populate('profile favoritePost')

        } catch (error) {
          console.log('There was an error adding or removing this post as a favorite', error.message)
        }
        throw new AuthenticationError('unable to add or remove this from your favorites.')
      }
    },
  }
}
module.exports = resolvers;



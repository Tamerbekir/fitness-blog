const typeDefs = `#graphql
  # all things associated with the models
  type Query {
    me: Profile
    profiles: [Profile!]
    profile(_id: ID!): Profile
    posts: [Post!]
    post(_id: ID!): Post
    topics: [Topic!]
    topic(_id: ID!): Topic
    comments: [Comment!]
    comment(_id: ID!): Comment
  }
  # all things associated with a profile
  type Profile {
    _id: ID!
    username: String!
    email: String!
    password: String!
    bio: String
    socialHandle: String
    location: String
    posts: [Post!] 
    reactions: [Post!]
    comments: [Comment!]
    favoritePost: [Post!]
    createdAt: String!
  }
  # all things associated with a post
  type Post {
    _id: ID!
    title: String!
    content: String!
    profile: Profile!  
    comments: [Comment!]
    reactions: [Profile!]
    favoritePost: [Profile!]
    topic: [Topic!]
    createdAt: String!
  }
  # all things associated with a comment
  type Comment {
    _id: ID!
    content: String!
    profile: Profile!  
    commentReplies: [Comment!]
    likes: [Profile!]
    dislikes: [Profile!]
    posts: [Post!]
    createdAt: String!
  }
  
  # all things associated with a topic
  type Topic {
    _id: ID!
    topicName: String!
    posts: [Post!]
  }
  # for auth and who its assigned to
  type Auth {
    token: ID!
    profile: Profile
  }

  # mutations- things that are needed to perform the actions 
  #!! Because I am using context.user for Auth I will not need to define ProfileID
  type Mutation {
    login(
      email: String!, 
      password: String!
    ): Auth

    addProfile(
      username: String!,
      email: String!,
      password: String!
      bio: String
      socialHandle: String
      location: String
    ): Auth

    updateProfile(
      username: String!,
      email: String!, 
      password: String!
      bio: String
      socialHandle: String
      location: String
    ): Profile

    # updatePassword(
    #   currentPassword: String!, 
    #   newPassword: String!
    # ): Profile

    removeProfile(
      _id: ID!
    ): Profile

    # adding and updating a post by profile and post id and removing a comment by its ID using the Comment model
    addPost(
      title: String!,
      content: String!,
      topic: String!
    ): Post

    updatePost(
      _id: ID!,
      title: String!, 
      content: String!, 
      topic: String!
    ): Post

    removePost(
      _id: ID!
    ): Post

    addOrRemoveReactionPost(
      postId: ID!
    ): Post
  
    # For comments
    # adding a comment using model ID 
    # able to update a comment from the post ID
    # removing a comment by the comments ID
    # replying to a comment using the comments ID 
    # removing a comment using the associated comment ID and the id of the reply
    # able to like and dislike a comment using the commentID
    addComment(
      postId: ID!, 
      content: String!
    ): Comment

    updateComment(
      commentId: ID!, 
      content: String!
    ): Comment

    removeComment(
      _id: ID!
    ): Comment

    replyToComment(
      commentId: ID!, 
      content: String!
    ): Comment

    removeReplyToComment(
      commentId: ID!,
      replyId: ID!
    ): Comment

    likeComment(
      commentId: ID!
    ): Comment

    dislikeComment(
      commentId: ID!
    ): Comment

  # adding favorite and unfavorite post by post ID
    addOrRemoveFavoritePost(
      postId: ID!
    ): Post
  }
`

module.exports = typeDefs;

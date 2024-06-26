import { gql } from '@apollo/client';


export const ADD_PROFILE = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!, $bio: String, $socialHandle: String, $location: String) {
  addProfile(username: $username, email: $email, password: $password, bio: $bio, socialHandle: $socialHandle, location: $location) {
      token
      profile {
        _id
        username
        email
        password
        bio
        location
        socialHandle
      }
    }
} 
`

export const LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    profile {
      username
      email
    }
  }
}
`

export const UPDATE_PROFILE = gql`
mutation Mutation($username: String!, $email: String!, $password: String!, $bio: String, $socialHandle: String, $location: String) {
  updateProfile(username: $username, email: $email, password: $password, bio: $bio, socialHandle: $socialHandle, location: $location) {
    _id
    email
    username
    location
    socialHandle
    bio
  }
}
`

export const REMOVE_PROFILE = gql`
mutation Mutation($id: ID!) {
  removeProfile(_id: $id) {
    _id
  }
}
`

export const ADD_POST = gql`
mutation Mutation($title: String!, $content: String!, $topic: String!) {
  addPost(title: $title, content: $content, topic: $topic) {
    _id
    title
    content
    topic {
      _id
      topicName
    }
  }
}
`

export const UPDATE_POST = gql`
mutation Mutation($id: ID!, $title: String!, $content: String!, $topic: String!) {
  updatePost(_id: $id, title: $title, content: $content, topic: $topic) {
    _id
    title
    content
    topic {
      _id
      topicName
    }
  }
}
`

export const REMOVE_POST = gql `
mutation Mutation($id: ID!) {
  removePost(_id: $id) {
    _id
  }
}
`


export const ADD_COMMENT = gql`
mutation AddComment($postId: ID!, $content: String!) {
  addComment(postId: $postId, content: $content) {
    _id
    content
  }
}
`


export const UPDATE_COMMENT = gql`
mutation Mutation($commentId: ID!, $content: String!) {
  updateComment(commentId: $commentId, content: $content) {
    _id
    content
  }
}
`

export const REMOVE_COMMENT = gql`
mutation Mutation($id: ID!) {
  removeComment(_id: $id) {
    _id
  }
}
`

export const REPLY_TO_COMMENT = gql`
mutation ReplyToComment($commentId: ID!, $content: String!) {
  replyToComment(commentId: $commentId, content: $content) {
    _id
    content
  }
}
`

export const REMOVE_REPLY_TO_COMMENT = gql`
mutation RemoveReplyToComment($commentId: ID!, $replyId: ID!) {
  removeReplyToComment(commentId: $commentId, replyId: $replyId) {
    _id
  }
}
`

export const LIKE_COMMENT = gql`
mutation Mutation($commentId: ID!) {
  likeComment(commentId: $commentId) {
    _id
  }
}
`

export const DISLIKE_COMMENT = gql`
mutation DislikeComment($commentId: ID!) {
  dislikeComment(commentId: $commentId) {
    _id
  }
}
`

export const ADD_OR_REMOVE_REACTION_POST = gql`
mutation Mutation($postId: ID!) {
  addOrRemoveReactionPost(postId: $postId) {
    _id
  }
}
`


export const ADD_OR_REMOVE_FAVORITE_POST = gql`
mutation AddOrRemoveFavoritePost($postId: ID!) {
  addOrRemoveFavoritePost(postId: $postId) {
    _id
  }
}`


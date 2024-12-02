import { gql } from '@apollo/client';


export const ADD_PROFILE = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!, $bio: String, $socialHandle: String, $location: String) {
  addProfile(username: $username, email: $email, password: $password, bio: $bio, socialHandle: $socialHandle, location: $location) {
      token
      profile {
        _id
        username
        email
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
  mutation RemoveProfile($_id: ID!) {
    removeProfile(_id: $_id) {
      _id
    }
  }
`;

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

export const REMOVE_POST = gql`
mutation removePost($id: ID!) {
  removePost(_id: $id) {
    _id
  }
}
`


export const ADD_WORKOUT = gql`
mutation addWorkout($exercise: String!, $reps: Float, $miles: Float, $sets: Float, $pace: Float, $weight: Float, $notes: String, $duration: Float, $calories: Float) {
  addWorkout(exercise: $exercise, reps: $reps, sets: $sets, miles: $miles, pace: $pace, weight: $weight, notes: $notes, duration: $duration, calories: $calories) {
    _id
  }
}
`

export const UPDATE_WORKOUT = gql`
mutation updateWorkout($id: ID!, $exercise: String!, $reps: Float, $weight: Float, $sets: Float, $miles: Float, $pace: Float, $notes: String, $duration: Float, $calories: Float) {
  updateWorkout(_id: $id, exercise: $exercise, reps: $reps, weight: $weight, sets: $sets, miles: $miles, pace: $pace, notes: $notes, duration: $duration, calories: $calories) {
    _id
    reps
    pace
    weight
    reps
    sets
    notes
    duration
    exercise {
      _id
      exerciseName
    }
  }
}
`

export const REMOVE_WORKOUT = gql`
  mutation Mutation($id: ID!) {
  removeWorkout(_id: $id) {
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
mutation removeComment($id: ID!) {
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
mutation AddOrRemoveFavoritePost($postId: ID!) {
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


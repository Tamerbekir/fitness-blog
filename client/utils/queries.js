import { gql } from '@apollo/client'

export const QUERY_ME = gql`
query Query {
  me {
    _id
    email
    username
    password
    location
    socialHandle
    bio
    createdAt
    workouts {
      _id
      weight
      reps
      sets
      miles
      pace
      notes
      createdAt
      exercise {
        exerciseName
      }
    }
    posts {
      _id
      title
      content
      topic {
        topicName
      }
      comments {
      _id
      content
      createdAt
      profile {
        _id
        username
      }
    }
    }
    favoritePost {
      title
    }
    reactions {
      _id
    }
  }
}
`;

export const QUERY_PROFILES = gql`
  query Profile {
    profiles {
      _id
      username
      email
      createdAt
      favoritePost {
        _id
        title
      }
      posts {
        _id
        title
        content
        topic {
          _id
          topicName
        } 
        comments {
          _id
          content
        }
      }
    }
  }
`

export const QUERY_POSTS = gql`
query Posts {
  posts {
    _id
    title
    content
    createdAt
    comments {
      _id
      content
      createdAt
      profile {
      _id
      username
      }
    }
    topic {
      topicName
    }
    profile {
      _id
      username
    }
  }
}
`


export const QUERY_TOPICS = gql`
  query Topic {
    topics {
      _id
      topicName
    }
  }
`

export const QUERY_EXERCISE = gql`
  query Exercise {
    exercises {
      _id
      exerciseName
    }
  }
`

export const QUERY_WORKOUTS = gql`
query Workout {
  workouts {
    _id
    weight
    reps
    sets
    pace
    notes
    miles
    createdAt
    exercise {
      exerciseName
    }
  }
}
`

export const QUERY_COMMENTS = gql`
  query Comment {
    comments {
      _id
      content
      createdAt
    }
  }
`
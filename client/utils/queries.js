import { gql } from '@apollo/client'

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
  query Post {
    posts {
      _id
      title
      content
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

export const QUERY_COMMENTS = gql`
  query Comment {
    comments {
      _id
      content
    }
  }
`
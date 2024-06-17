import { gql } from '@apollo/client'

export const QUERY_PROFILES = gql`
  query Profiles {
    profiles {
      _id
      username
      email
    }
  }
`

export const QUERY_POSTS = gql`
  query Posts {
    posts {
      _id
      title
      content
    }
  }
`

export const QUERY_TOPICS = gql`
  query Topics {
    topics {
      _id
      topicName
    }
  }
`

export const QUERY_COMMENTS = gql`
  query Comments {
    comments {
      _id
      content
    }
  }
`
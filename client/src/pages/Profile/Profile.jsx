import Auth from '../../../utils/auth'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { QUERY_ME } from '../../../utils/queries'

const Profile = () => {
  const loggedIn = Auth.loggedIn()
  const { loading, error, data } = useQuery(QUERY_ME)

  const loginPage = () => {
    window.location.href = "./login"
  }

  
  
  
  if (loading) return <p>Loading your profile.</p>
  if (error) return <div> <p> Whoops! You need to be logged in to do that.</p><button onClick={loginPage}> Login</button></div>
  if (!data || !data.me) return <p>Profile not found</p>

  const posts = data.me.posts
  const favoritePosts = data.me.favoritePost
  // console.table(data.me.favoritePost)
  
  
  return (
    <div>
      {loggedIn && <p>if you can read this then user is Authenticated</p>}
      <div>
        <h3>These are your posts:</h3>
        {posts.map((post, index) => (
          <div key={index}>

            {/* bringing in title by user*/}
            <h2>{post.title}</h2>

            {/* bringing in posts by user*/}
            <p>{post.content}</p>

              {/* mapping over posts and getting title for user */}
              {/* <p>Topic:</p> */}
            {post.topic.map((topic, index) => (
                <p key={index}>{topic.topicName}</p>
              ))}

              {/* mapping over favorites and getting title for user */}
            <h2>Your favorites</h2>
            {favoritePosts.map((favorite, index) => (
              <p key={index}> {favorite.title}</p>
            ))}  

          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile
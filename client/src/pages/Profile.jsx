import { useQuery } from "@apollo/client";
import { QUERY_PROFILES } from "../../utils/queries";

const Profile = () => {
  const { loading, error, data } = useQuery(QUERY_PROFILES)

  if (loading) return <p>Loading profiles..please wait</p> 
  if (error) return <p>Error:{ error.message }</p> 
  console.log('Data for profiles:', data)
  if (!data || !data.profiles) return <p>No profiles found</p>


  return (
    <div>
      <h2>Profiles</h2>
      {data.profiles.map(profile => (
        <div key={profile._id}>
          <p>{profile.username}</p>
          <p>{profile.email}</p>
          <p>there favorite posts are {profile.title}</p>

      {profile.posts.map(post => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>

      {post.comments.map(comment => (
        <div key={comment._id}>
          <p>{comment.content}</p>
        
        </div>
      ))}

            

            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Profile

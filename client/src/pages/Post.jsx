import { useQuery } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/queries";

const Post = () => {
  const { loading, error, data } = useQuery(QUERY_POSTS)

  if (loading) return <p>Loading...please wait</p> 
  if (error) return <p>Error: { error.message }</p> 
  console.table(['Data for posts:', data])
  if (!data.posts) return <p>No posts found!</p>

  return (
    <div>
      <h2>Posts seeds!</h2>
      <h3>Posts</h3>
      {data.posts.map(post => (
        <div key={post._id}> 
        <h3>{post.title}</h3>
        <h5>{post.content}</h5>
        </div>
      ))}
    </div>
  )
}

export default Post
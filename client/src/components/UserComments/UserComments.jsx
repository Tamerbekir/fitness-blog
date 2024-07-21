import { useQuery } from "@apollo/client";
import { QUERY_COMMENTS } from "../../../utils/queries";

const UserComments = () => {
  const { loading, error, data } = useQuery(QUERY_COMMENTS)

  if (loading) return <p>Loading comments..please wait</p> 
  if (error) return <p>Error: { error.message } </p> 
  console.table(['Data for comments:', data])
  if (!data.comments) return <p>No comments found!</p>

  return (
    <div>
      <h2>Comments for seeds!</h2> 
      <h3>Comments</h3>
      {data.comments.map(comment => (
        <div key={comment._id}>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  )
} 

export default UserComments
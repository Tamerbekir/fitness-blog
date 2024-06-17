import { useQuery } from "@apollo/client";
import { QUERY_COMMENTS } from "../../utils/queries";

const Comment = () => {
  const { loading, error, data } = useQuery(QUERY_COMMENTS)

  if (loading) return <p>Loading comments..please wait</p> 
  if (error) return <p>Error: { error.message } </p> 
  console.table(['Data for comments:', data])
  if (!data.comments) return <p>No comments found!</p>

  return (
    <div>
      <h2>Comments for seeds!</h2>
      {data.comments.map(comment => 
        <div key={data.comment._id}>
          <P>{comment.content}</P>
        </div>
      )}
    </div>
  )
}

export default Comment
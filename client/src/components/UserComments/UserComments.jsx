import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import { QUERY_COMMENTS } from "../../../utils/queries";
import DeleteComment from "../DeleteComment/DeleteComment";

 const UserComments = ({ postComments }) => {
  const { loading, error, data, refetch } = useQuery(QUERY_COMMENTS)

  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME)


  if (loading || loadingMe) return <p>Loading comments..please wait</p> 
  if (error || errorMe) return <p>Error: { error.message } </p> 
  console.table(['Data for comments:', data])
  if (!data.comments || !dataMe) return <p>No comments found!</p>

  // const postComments = data.comments



  return (
    <div>
      <h2>Comments</h2>
      {postComments.map(comment => (
        <div 
          key={comment._id}
          refetch={refetch}
        >
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
} 

export default UserComments
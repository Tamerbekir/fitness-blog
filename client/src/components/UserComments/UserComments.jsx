import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import { QUERY_COMMENTS } from "../../../utils/queries";
import DeleteComment from "../DeleteComment/DeleteComment";

// the prop, postComments, is being brought in from the Home.jsx. There postComments is defined as post.comments (within the posts data)
const UserComments = ({ postComments }) => {
  // const { loading, error, data, refetch } = useQuery(QUERY_COMMENTS)

  // const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME)


  // if (loadingMe) return <p>Loading comments..please wait</p>
  // if (errorMe) return <p>Error: {error.message} </p>
  // console.table(['Data for comments:', data])
  // if (!dataMe) return <p>No comments found!</p>



  return (
    <div>

    </div>
  );
}


export default UserComments
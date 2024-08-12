import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import { QUERY_COMMENTS } from "../../../utils/queries";
import DeleteComment from "../DeleteComment/DeleteComment";
import './assets/userComments.css'
import { Box } from "@mui/material";
import Auth from "../../../utils/auth";

// the prop, postComments, is being brought in from the Home.jsx. There postComments is defined as post.comments (within the posts data)
const UserComments = ({ postComments, refetch }) => {

  const loggedIn = Auth.loggedIn()

  const {
    loading: loadingComments,
    error: errorComments,
    data: dataComments
  } = useQuery(QUERY_COMMENTS)

  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe
  } = useQuery(QUERY_ME)


  if (loadingMe) return <p>Loading comments..please wait</p>
  if (errorMe) return <p>Error: {errorMe.message} </p>
  if (!dataMe) return <p>No comments found!</p>

  return (
    <div>
      {loggedIn && (
        <div>
          {/* Mapping over the post.comments and setting a variable to define if the user's comment belongs to them. We take the data ME query we defined above and compare the QUERY ME id with the profile._id within the comments of the post  */}
          {postComments.map(comment => {
            const isUsersComment = dataMe.me._id === comment.profile._id;

            return (
              <div className="commentsDiv" key={comment._id}>
                <Box className="commentContent">{comment.content}</Box>
                <p className="commentUsername">{comment.profile.username}</p>
                <Box className='commentDate'>{new Date(parseInt(comment.createdAt)).toLocaleDateString()}</Box>
                {isUsersComment && (
                  <DeleteComment
                    commentId={comment._id}
                    refetch={refetch}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* User will get comments rendered with out the data me if they are not logged in and will not display the delete button  */}
      {!loggedIn && (
        <div>
          {postComments.map(comment => {
            return (
              <div className="commentsDiv" key={comment._id}>
                <Box className="commentContent">{comment.content}</Box>
                <p className="commentUsername">{comment.profile.username}</p>
                <Box className='commentDate'>{new Date(parseInt(comment.createdAt)).toLocaleDateString()}</Box>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



export default UserComments
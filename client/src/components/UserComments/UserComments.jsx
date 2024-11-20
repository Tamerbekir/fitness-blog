import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import DeleteComment from "../DeleteComment/DeleteComment.jsx";
import './assets/userComments.css';
import { Box } from "@mui/material";
import Auth from "../../../utils/auth";
import UserReplyComment from "../UserReplyComment/UserReplyComment.jsx";
import Collapse from 'react-bootstrap/Collapse';
import { useState } from "react";
import Button from 'react-bootstrap/Button';
// import DeleteReplyComment from '../DeleteReplyComment/DeleteReplyComment';


const UserComments = ({ replyId, postComments, refetch, postCommentReplies }) => {
  const loggedIn = Auth.loggedIn();

  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME);

  const [open, setOpen] = useState(false);

  if (loadingMe) return <p>Loading comments...please wait</p>;
  if (errorMe) return <p>Error: {errorMe.message}</p>;
  if (!dataMe) return <p>No comments found!</p>;

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
                <p className="commentUsername">
                  {comment.profile.username}
                </p>
                <Box className="commentDate">
                  {new Date(parseInt(comment.createdAt)).toLocaleDateString()}
                </Box>

                <UserReplyComment
                  commentId={comment._id}
                  refetch={refetch}
                  postCommentReplies={postCommentReplies}
                />


                <Collapse in={open}>
                  <div className="commentReplies">
                    {(comment.commentReplies).map((reply, index) => (
                      <div className="userReplyComment" key={index}>
                        <p className="replyCommentUsername">
                          {/* throwing error with user name, will leave this as a temp */}
                          {reply.profile.username}
                        </p>
                        <Box className="replyContent">
                          @{comment.profile.username} {reply.content}
                        </Box>
                        <Box className="commentDateReply">
                          {new Date(parseInt(reply.createdAt)).toLocaleDateString()}
                          {/* <DeleteReplyComment
                            commentId={comment._id}
                            replyId={replyId}
                          /> */}
                        </Box>
                      </div>
                    ))}
                  </div>
                </Collapse>

                <p
                  style={{ cursor: 'pointer' }}
                  className="viewAllCommentsBtn"
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                >
                  {!open
                    ? `View ${comment.commentReplies.length} replies`
                    : "Collapse"}
                </p>

                {isUsersComment && (
                  <DeleteComment commentId={comment._id} refetch={refetch} />
                )}
              </div>
            );
          })}
        </div >
      )}

      {
        !loggedIn && (
          <div>
            {postComments.map((comment) => (
              <div className="commentsDiv" key={comment._id}>
                <Box className="commentContent">{comment.content}</Box>
                <p className="commentUsername">
                  {comment.profile?.username || "Anonymous"}
                </p>
                <Box className="commentDate">
                  {new Date(parseInt(comment.createdAt)).toLocaleDateString()}
                </Box>
              </div>
            ))}
          </div>
        )
      }
    </div >
  );
};

export default UserComments;

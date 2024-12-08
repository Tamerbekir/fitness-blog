import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import DeleteComment from "../DeleteComment/DeleteComment.jsx";
import './assets/userComments.css';
import { Box, Button } from "@mui/material";
import Auth from "../../../utils/auth";
import UserReplyComment from "../UserReplyComment/UserReplyComment.jsx";
import Collapse from 'react-bootstrap/Collapse';
import { useState } from "react";
import DeleteReplyComment from '../DeleteReplyComment/DeleteReplyComment';
import LikeComment from '../LikeDislikeComment/LikeComment.jsx'
import DislikeComment from '../LikeDislikeComment/DislikeComment.jsx'
// import Usernames from "../UserNames/Usernames.jsx";


const UserComments = ({ postComments, refetch, postCommentReplies, replyId }) => {
  const loggedIn = Auth.loggedIn();

  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME);

  const [open, setOpen] = useState(false);
  const [replyComment, setReplyComment] = useState(true)

  const handleLikeDislikeForm = () => {
    setReplyComment(false)
  }

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
                <UserReplyComment
                      commentId={comment._id}
                      refetch={refetch}
                      postCommentReplies={postCommentReplies}
                      />
                <p className="commentUsername">
                  {comment.profile.username}
                </p>
                <Box className="commentDate">
                  {new Date(parseInt(comment.createdAt)).toLocaleDateString()}
                </Box>
                {/* Like and dislike parent comment for users, referring to the main parent comment when mapping over post comments */}

                  <div className="userPostOptions">

                      <>
                      <LikeComment
                        commentId={comment._id}
                        refetch={refetch}
                        postCommentReplies={postCommentReplies}
                      />
                      <p className="likeDislikeLength">{comment.likes.length}</p>
                      <DislikeComment
                        commentId={comment._id}
                        refetch={refetch}
                        postCommentReplies={postCommentReplies}
                      />
                      <p className="likeDislikeLength">{comment.dislikes.length}</p>
                      </>
                    </div>
  



                <Collapse in={open}>
                  <div className="commentReplies">
                    {/* mapping over comment replies */}
                    {comment.commentReplies.map((reply) => {
                      console.log("reply id", reply._id);
                      return (
                        <div className="userReplyComment" key={reply._id}>
                          <p className="replyCommentUsername">
                            {/* the profile name of the user that is leaving replied comment. If no user, profile name will show as deleted */}
                            {reply.profile.username || "Deleted Profile"}
                          </p>
                          <Box className="replyContent">
                            {/* Profile of the user who left parent comment that is being replied to. Only working for parent profile and not the profiles of the users replying. Will fix soon. Content for reply displays here */}
                            {reply.content}
                            <UserReplyComment
                              commentId={comment._id}
                              refetch={refetch}
                              postCommentReplies={postCommentReplies}
                            />
                            {/* @{comment.profile.username} {reply.content} */}
                          </Box>
                          <Box className="commentDateReply">
                            {/* show date of reply */}
                            {new Date(parseInt(reply.createdAt)).toLocaleDateString()}
                            {/* comment id is referring to the reply id when mapping over replies, so users can like replied comments separately */}
                            <div className="userPostOptions">
                            <LikeComment
                              commentId={reply._id}
                              replyId={replyId}
                              refetch={refetch}
                            />
                            <p className="likeDislikeLength">{reply.likes.length}</p>
                            <DislikeComment
                              commentId={reply._id}
                              replyId={replyId}
                              refetch={refetch}
                            />
                            <p className="likeDislikeLength">{reply.dislikes.length}</p>
                            </div>
                            {/* Reply icon which displays from the reply comment component and mutation  */}
                            <DeleteReplyComment
                              commentId={comment._id}
                              replyId={reply._id}
                              refetch={refetch}
                            />
                          </Box>
                        </div>
                      );
                    })}
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
                  {comment.profile.username || "Deleted Profile"}
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

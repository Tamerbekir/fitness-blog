import { useEffect, useState } from "react";
import {
  Card,
  Button,
} from "react-bootstrap";
import Avatar from "react-avatar";
import { useQuery } from "@apollo/client";
import {
  QUERY_ME,
  QUERY_PROFILES,
  QUERY_COMMENTS,
} from "../../../utils/queries";
import DeletePost from "../DeletePost/DeletePost.jsx";
import AddReaction from "../AddReaction/AddReaction";
import EditPost from "../EditPost/EditPost.jsx";
import AddComment from "../AddComment/AddComment.jsx";
import UserComments from "../UserComments/UserComments.jsx";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/postCard.css";

const PostCard = ({
  postId,
  postComments,
  showYouForPost,
  username,
  title,
  content,
  topicName,
  createdAt,
  showDeletePostBtn,
  // showDeleteCommentBtn,
  showEditBtn,
  refetch,
}) => {
  const { loading, error, data } = useQuery(QUERY_PROFILES);
  const {
    loading: loadingComments,
    error: errorComments,
    data: dataComments,
  } = useQuery(QUERY_COMMENTS);
  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe,
  } = useQuery(QUERY_ME);

  const [userLeaveComment, setUserLeaveComment] = useState(false);
  const [userAccount, setUserAccount] = useState({
    _id: "",
  });

  useEffect(() => {
    if (data) {
      setUserAccount({
        ...userAccount,
        _id: data.profiles._id,
      });
    }
  }, [data]);

  const handleCommentClick = () => {
    setUserLeaveComment(!userLeaveComment);
  };

  if (loading || loadingMe || loadingComments) return <p>Loading...</p>;
  if (error || errorMe || errorComments) return <p>{error}</p>;
  if (!data || !dataMe || !dataComments) return <p>No profile found..</p>;

  return (
    <Card className="my-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Avatar name={username} size="40" round={true} className="me-2" />
        <div>{showYouForPost ? <p>You</p> : <p>{username}</p>}</div>
        <small>{createdAt}</small>
      </Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <Card.Text className="text-muted">{topicName}</Card.Text>
      </Card.Body>

      <div className="postIcons">
        <Button className="faveBtn">Favorite</Button>
        {!userLeaveComment ? (
          <Button className="commentBtn" onClick={handleCommentClick}>
            View Comments
          </Button>
        ) : (
          <Button className="commentBtn" onClick={handleCommentClick}>
            Close Comments
          </Button>
        )}
        <Button className="shareBtn">Share</Button>
        <Button className="reactBtn">React</Button>
      </div>
      {showEditBtn && (
        <div className="postCardIconDiv">
          <EditPost 
            className="editIcon" 
            postId={postId} 
            refetch={refetch} />
        </div>
      )}

      {userLeaveComment && (
        <>
          <AddComment postId={postId} refetch={refetch} />
          <UserComments postComments={postComments} refetch={refetch} />
        </>
      )}
    </Card>
  );
};

export default PostCard;

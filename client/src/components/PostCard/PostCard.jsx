import { useEffect, useState } from "react";
import { Card, Button, Collapse, OverlayTrigger, Tooltip, ListGroup } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_PROFILES, QUERY_COMMENTS } from "../../../utils/queries";
import DeletePost from "../DeletePost/DeletePost.jsx";
import AddReaction from '../AddReaction/AddReaction';
import EditPost from "../EditPost/EditPost.jsx";
import AddComment from '../AddComment/AddComment.jsx';
import UserComments from '../UserComments/UserComments.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/postCard.css'


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
  showDeleteCommentBtn,
  showEditBtn,
  refetch,
}) => {
  const { loading, error, data } = useQuery(QUERY_PROFILES);
  const { loading: loadingComments, error: errorComments, data: dataComments } = useQuery(QUERY_COMMENTS);
  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME);

  const [expanded, setExpanded] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [userLeaveComment, setUserLeaveComment] = useState(false);
  const [userAccount, setUserAccount] = useState({
    _id: ''
  });

  useEffect(() => {
    if (data) {
      setUserAccount({
        ...userAccount,
        _id: data.profiles._id
      });
    }
  }, [data]);

  const handleCommentClick = () => {
    setUserLeaveComment(!userLeaveComment);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleReactionClick = () => {
    setShowEmojis(!showEmojis);
  };

  if (loading || loadingMe || loadingComments) return <p>Loading...</p>;
  if (error || errorMe || errorComments) return <p>{error}</p>;
  if (!data || !dataMe || !dataComments) return <p>No profile found..</p>;

  return (
    <Card className="my-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Avatar name={username} size="40" round={true} className="me-2" />
        <div>
          {showYouForPost ? <p>You</p> : <p>{username}</p>}
        </div>
        <small>{createdAt}</small>
      </Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{content}</Card.Text>
        <Card.Text className="text-muted">{topicName}</Card.Text>
      </Card.Body>
      <ListGroup variant="flush">
        <ListGroup.Item className="d-flex justify-content-start">
          <OverlayTrigger overlay={<Tooltip>Add to favorites</Tooltip>}>
            <Button variant="link" className="p-0 me-2">
              <i className="bi bi-heart"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Share</Tooltip>}>
            <Button variant="link" className="p-0 me-2">
              <i className="bi bi-share"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Comment</Tooltip>}>
            <Button variant="link" className="p-0 me-2" onClick={handleCommentClick}>
              <i className="bi bi-chat-dots"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>React</Tooltip>}>
            <Button variant="link" className="p-0 me-2" onClick={handleReactionClick}>
              <i className="bi bi-emoji-smile"></i>
            </Button>
          </OverlayTrigger>
        </ListGroup.Item>
      </ListGroup>
      <Collapse in={expanded}>
        <Card.Body>
          {showEditBtn && <EditPost postId={postId} refetch={refetch} />}
        </Card.Body>
      </Collapse>
      {showDeletePostBtn && showEditBtn &&
        <div className="postCardIconDiv">
          <DeletePost className='deleteIcon' postId={postId} refetch={refetch} />
          <EditPost className='editIcon' postId={postId} refetch={refetch} />
        </div>
      }

      <AddComment postId={postId} refetch={refetch} />
      <UserComments postComments={postComments} refetch={refetch} />
      <ToastContainer />
    </Card>
  );
};

export default PostCard;

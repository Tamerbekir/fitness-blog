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
import { useNavigate } from "react-router-dom";
// import Reaction from "../Reactions/Reactions.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { QUERY_POSTS } from "../../../utils/queries";

const PostCard = ({
  postId,
  postComments,
  showYouForPost,
  username,
  title,
  content,
  topicName,
  createdAt,
  showEditBtn,
  refetch,
}) => {
  const {
    loading: LoadingProfiles,
    error: errorProfiles,
    data: dataProfiles,
  } = useQuery(QUERY_PROFILES);

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

  const {
    loading: loadingPosts,
    error: errorPosts,
    data: dataPosts,
  } = useQuery(QUERY_POSTS)

  const [userLeaveComment, setUserLeaveComment] = useState(false);

  const navigate = useNavigate()

  if (!dataPosts) {
    return 'loading'
  }


  if (!dataProfiles || !dataMe || !dataComments || !dataPosts) return <p>No profile found..</p>;

  if (dataProfiles) {
    const allPosts = dataProfiles.profiles.map(profile => profile.posts.map(post => ({ ...post, userId: profile._id })))
    // console.log('all posts', allPosts)
  }

  const userProfile = (userId) => {
    navigate(`/userprofile/${userId}`)
    console.log(userId)
  }

  const handleCommentClick = () => {
    setUserLeaveComment(!userLeaveComment);
  };

  if (LoadingProfiles || loadingMe || loadingComments || loadingPosts) return <p>Loading...</p>;
  if (errorProfiles || errorMe || errorComments || errorPosts) return <p>{errorProfiles}</p>;

  return (
    <Card className="my-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Avatar
          key={postId}
          onClick={() => userProfile(post.userId)}
          name={username}
          style={{ cursor: 'pointer' }}
          size="40"
          round={true}
          className="me-2" />
        <div>{showYouForPost ? <p>You</p> : <p>{username}</p>}</div>
        <small>{createdAt}</small>
      </Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <Card.Text className="text-muted">{topicName}</Card.Text>
      </Card.Body>
      <div className="postIcons">
        {/* Bring back after applying css to fit via mobile */}
        {/* <Reactiosn /> */}
        {!userLeaveComment ? (

          <Button className="commentBtn" onClick={handleCommentClick}>
            {postComments.length} {' '}
            <FontAwesomeIcon icon={faComment} />
          </Button>
        ) : (
          <Button className="commentBtn" onClick={handleCommentClick}>
            Close {' '}
            <FontAwesomeIcon icon={faComment} />
          </Button>
        )}
        <Button className="faveBtn">Favorite</Button>
        <Button className="shareBtn">Share</Button>
      </div>

      {
        showEditBtn && (
          <div className="postCardIconDiv">
            <EditPost
              className="editIcon"
              postId={postId}
              refetch={refetch} />
          </div>
        )
      }
      {
        userLeaveComment && (
          <>
            <AddComment postId={postId} refetch={refetch} />
            <UserComments postComments={postComments} refetch={refetch} />
          </>
        )
      }
    </Card >
  );
};

export default PostCard;

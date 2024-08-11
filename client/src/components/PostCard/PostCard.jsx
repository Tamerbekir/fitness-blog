import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
// import CardMedia from '@mui/material/CardMedia';
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import DeletePost from "../DeletePost/DeletePost";
import CommentIcon from '@mui/icons-material/Comment';
import Person2Icon from '@mui/icons-material/Person2';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Paper from '@mui/material/Paper';
import 'react-toastify/dist/ReactToastify.css';
import AddReaction from '../AddReaction/AddReaction'
import EditPost from "../EditPost/EditPost";
import { Box } from "@mui/material";

import { useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_PROFILES, QUERY_COMMENTS } from "../../../utils/queries";

import AddComment from '../AddComment/AddComment'
import UserComments from '../UserComments/UserComments'
import DeleteComment from "../DeleteComment/DeleteComment";




const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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

  const { loading, error, data } = useQuery(QUERY_PROFILES)

  const { loading: loadingComments, error: errorComments, data: dataComments } = useQuery(QUERY_COMMENTS)

  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME)


  const [expanded, setExpanded] = useState();
  const [showEmojis, setShowEmojis] = useState()
  const [userLeaveComment, setUserLeaveComment] = useState()
  const [userAccount, setUserAccount] = useState({
    _id: ''
  })

  useEffect(() => {
    if (data) {
      setUserAccount({
        ...userAccount,
        _id: data.profiles._id
      })
    }
  }, [data])



  const handleCommentClick = () => {
    setUserLeaveComment(!userLeaveComment)
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleReactionClick = () => {
    setShowEmojis(!showEmojis)
  }

  // const viewUserProfile = () => {
  //   window.location.href = '/useraccount/{userAccount._id}'
  // }


  // if (loading || loadingComments) return <p>Loading...</p>
  // if (error || errorComments) return <p>{error}</p>
  // if (!data || !dataComments) return <p>No profile found..</p>

  if (loading || loadingMe || loadingComments) return <p>Loading...</p>
  if (error || errorMe || errorComments) return <p>{error}</p>
  if (!data || !dataMe || !dataComments) return <p>No profile found..</p>

  return (
    <Card sx={{ maxWidth: 10000, margin: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            // onClick={viewUserProfile}
            // key={userAccount._id}
            sx={{ bgcolor: '#44074d' }} aria-label="recipe">
            {username[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="profile">
            <Person2Icon />
            <Typography variant="body2" color="text.primary">
              {showYouForPost && (<p>You</p>)}
              {!showYouForPost && (<p>{username}</p>)}
            </Typography>
            {/* <MoreVertIcon /> */}
          </IconButton>
        }
        title={title}
        subheader={createdAt}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
        <Typography sx={{ marginTop: 1 }} variant="body1" color="text.primary">
          {topicName}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

        <IconButton onClick={handleCommentClick} aria-expanded={userLeaveComment} aria-label="comment">
          <CommentIcon />
        </IconButton>


        {/* Adding and seeing reactions */}
        <IconButton onClick={handleReactionClick} aria-expanded={showEmojis} aria-label="show emojis">
          <AddReactionIcon postId={postId} refetch={refetch} />
        </IconButton>

        {/* Adding and seeing comments */}
        {/* <Collapse in={userLeaveComment} timeout='auto' unmountOnExit> */}
        {/* <Paper>
            <AddComment postId={postId}  refetch={refetch} /> 
            <Box name="" id="">
              <UserComments />
            </Box>
          </Paper> */}
        {/* </Collapse> */}

        <Collapse in={showEmojis} timeout='auto' unmountOnExit>
          <Paper>
            <AddReaction />
          </Paper>
        </Collapse>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>

        {showDeletePostBtn && (
          <DeletePost
            postId={postId}
            refetch={refetch}
          />
        )}

        {/* <ToastContainer /> */}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {showEditBtn && (
            <EditPost
              postId={postId}
              refetch={refetch}
            />
          )}
        </CardContent>
      </Collapse>

      {/* <Paper> */}
      <AddComment
        postId={postId}
        refetch={refetch}
      />
      <Box >
        <UserComments
          postComments={postComments}
          refetch={refetch}
        />
      </Box>
      <Box>
        {/* deleting and adding showing but all users getting delete option */}
        {postComments.map(comment => (
          <div key={comment._id} >
            <Box>{comment.content}</Box>
            <Box>{new Date(parseInt(comment.createdAt)).toLocaleDateString()}
            </Box>
            <DeleteComment
              commentId={comment._id}
              refetch={refetch}
            />
            {/* <p>{comment.profile.username}</p> */}
          </div>
        ))}
      </Box>
    </Card >
  );
};

export default PostCard;

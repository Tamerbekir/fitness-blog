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
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import DeletePost from "../DeletePost/DeletePost";
import CommentIcon from '@mui/icons-material/Comment';
import Person2Icon from '@mui/icons-material/Person2';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Paper from '@mui/material/Paper';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import AddReaction from '../AddReaction/AddReaction'
import EditIcon from '@mui/icons-material/Edit';
import EditPost from "../EditPost/EditPost";





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
  showYouForPost,
  username,
  title,
  content,
  topicName,
  createdAt,
  showDeleteBtn,
  showEditBtn,
  refetch,
}) => {
  const [expanded, setExpanded] = useState();
  const [showEmojis, setShowEmojis] = useState()
  const [loggedIn, setLoggedInAction] = useState('Hey')


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleReactionClick = () => {
    setShowEmojis(!showEmojis)
  }

  return (
    <Card sx={{ maxWidth: 10000, margin: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#44074d' }} aria-label="recipe">
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
        <IconButton aria-label="comment">
          <CommentIcon />
        </IconButton>
        {/* once clicked on the icon button for AddReactionIcon, run useState which shows emojis to click on  */}


          <IconButton onClick={handleReactionClick} aria-expanded={showEmojis} aria-label="show emojis">
            <AddReactionIcon postId={postId} />
          </IconButton>


        <Collapse in={showEmojis} timeout='auto' unmountOnExit>
          <Paper>
            <AddReaction />
          </Paper>
        </Collapse>
        <IconButton />
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
        {showDeleteBtn && (
          <DeletePost postId={postId} refetch={refetch} />
        )}
        <ToastContainer />
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {showEditBtn && (
            <EditPost postId={postId} refetch={refetch} />
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;

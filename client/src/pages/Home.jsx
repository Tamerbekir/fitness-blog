import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../../utils/queries";
import Auth from "../../utils/auth";
import PostCard from "../components/PostCard/PostCard.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { ToastContainer } from "react-toastify";


const Home = () => {
  const loggedIn = Auth.loggedIn();

  const {
    loading: loadingPosts,
    error: errorPosts,
    data: dataPosts,
    refetch
  } = useQuery(QUERY_POSTS);

  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe
  } = useQuery(QUERY_ME);

  const usernameInitial = (str) => {
    return str.toUpperCase();
  };

  const login = () => {
    window.location.href = "./login";
  };

  const signUp = () => {
    window.location.href = "./signup";
  };

  if (loadingPosts || loadingMe) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorPosts || errorMe) {
    return <p>Error: {errorPosts.message}</p>;
  }

  if (!dataPosts || !dataMe) {
    return <p>No posts found</p>;
  }



  return (
    <div>
      <div>
        {loggedIn && dataMe && (
          <>
            <h1 className="welcomeHomeText">
              Hey there, {dataMe.me.username}, check out the latest posts!
            </h1>
            {dataPosts.posts.map((post) => (
              <PostCard
                className="postCardHome"
                key={post._id}
                postId={post._id}
                postComments={post.comments}
                title={post.title}
                username={usernameInitial(post.profile.username)}
                content={post.content}
                createdAt={new Date(parseInt(post.createdAt)).toLocaleDateString()}
                topicName={post.topic.map((topic) => topic.topicName)}
                showYouForPost={dataMe.me._id === post.profile._id}
                showDeletePostBtn={dataMe.me._id === post.profile._id}
                showEditBtn={dataMe.me._id === post.profile._id}
                refetch={refetch}
              >
              </PostCard>
            ))}
          </>
        )}
      </div>
      <div>
        {!loggedIn && (
          <div>
            <h1 className="welcomeHomeText">Welcome to the Fitness Blog!</h1>
            <div className="signInOrSignupDiv">
              <p>Not already a member?</p>
              <p>
                Be sure to <Button onClick={login}> Login </Button>
                or
                <Button onClick={signUp}> sign up </Button> here.
              </p>
            </div>
            {dataPosts.posts.map((post) => (
              <PostCard
                className="PostCard"
                key={post._id}
                title={post.title}
                postComments={post.comments}
                username={usernameInitial(post.profile.username)}
                content={post.content}
                createdAt={new Date(parseInt(post.createdAt)).toLocaleDateString()}
                topicName={post.topic.map((topic) => topic.topicName)}
              >
              </PostCard>
            ))}
          </div>
        )}
        <ToastContainer />

      </div>
    </div >
  );
};

export default Home;

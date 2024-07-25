import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME, QUERY_COMMENTS } from "../../utils/queries";
import Auth from "../../utils/auth";
import PostCard from "../components/PostCard/PostCard";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// import Popper from '@mui/material/Popper';

const Home = () => {
  const loggedIn = Auth.loggedIn();


  const { 
    loading: loadingPosts, 
    error: errorPosts, 
    data: dataPosts, 
    refetch } = useQuery(QUERY_POSTS);

  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe,
  } = useQuery(QUERY_ME)

  // const {
  //   loading: loadingComments,
  //   error: errorComments,
  //   data: dataComments,
  // } = useQuery(QUERY_COMMENTS)

 
  const usernameInitial = (str) => {
    return str.toUpperCase();
  };

  const login = () => {
    window.location.href = "./login";
  }

  const signUp = () => {
    window.location.href = "./signup";
  };


  if (loadingPosts || loadingMe)   
    return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
  if (errorPosts || errorMe) return <p>Error: {errorPosts.message}</p>;
  if (!dataPosts || !dataMe) return <p>No posts found</p>;

  return (
    <div>
      <div>
        {loggedIn && !loadingMe && !errorMe && dataMe && (
          <>
          {/* <div>
            {showPopup && <Popup onClose={() => setShowPopup(false)} />}
          </div> */}
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
                showYouForPost={dataMe.me._id === post.profile._id}
                username={usernameInitial(post.profile.username)}
                content={post.content}
                createdAt={post.createdAt}
                topicName={post.topic.map((topic) => topic.topicName)}
                showDeletePostBtn={dataMe.me._id === post.profile._id}
                showDeleteCommentBtn={dataMe.me._id === post.comments._id}
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
            <h1>Welcome to the Fitness Blog!</h1>
            <p>Not already a member?</p>
            <p>
              Be sure to <button onClick={login}>Login</button> or{" "}
              <button onClick={signUp}>sign up</button> here.
            </p>
            {dataPosts.posts.map((post) => (
              <PostCard
                className="PostCard"
                key={post._id}
                title={post.title}
                username={usernameInitial(post.profile.username)}
                content={post.content}
                createdAt={post.createdAt}
                topicName={post.topic.map((topic) => topic.topicName)}
              >
              </PostCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

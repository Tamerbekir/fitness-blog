import { useQuery } from "@apollo/client";
// import { useEffect } from "react";
// import { useState } from "react";
import { QUERY_POSTS, QUERY_ME } from "../../utils/queries";
import Auth from "../../utils/auth";
import PostCard from "../components/PostCard/PostCard";
// import Box from '@mui/material/Box';
// import Popper from '@mui/material/Popper';

const Home = () => {
  const loggedIn = Auth.loggedIn();

  const { loading, error, data, refetch } = useQuery(QUERY_POSTS);
  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe,
  } = useQuery(QUERY_ME)

  // const [showPopup, setShowPopup] = useState()

  // useEffect(()=> {
  //   const userSeenPopup = localStorage.getItem('seenPopup')
  //   if (!userSeenPopup) {
  //     setShowPopup(true)
  //     localStorage.setItem('seenPopup', 'true')
  //   }
  // }, [])
 
  const usernameInitial = (str) => {
    return str.toUpperCase();
  };

  const login = () => {
    window.location.href = "./login";
  }

  const signUp = () => {
    window.location.href = "./signup";
  };

  // const Popup = ({ onClose }) => {
  //   <div>
  //     <div>
  //     <Popper id={id} open={open} anchorEl={anchorEl}>
  //       <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
  //         The content of the Popper.
  //       </Box>
  //     </Popper>
  //       <button onClick={onClose}></button>
  //     </div>
  //   </div>
  // }

  if (loading) return <p>Loading...please wait</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No posts found</p>;

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
            {data.posts.map((post) => (
              <PostCard
                className="postCardHome"
                key={post._id}
                postId={post._id}
                title={post.title}
                showYouForPost={dataMe.me._id === post.profile._id}
                username={usernameInitial(post.profile.username)}
                content={post.content}
                createdAt={post.createdAt}
                topicName={post.topic.map((topic) => topic.topicName)}
                showDeleteBtn={dataMe.me._id === post.profile._id}
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

            {data.posts.map((post) => (
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

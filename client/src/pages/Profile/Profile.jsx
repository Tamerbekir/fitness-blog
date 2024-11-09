import Auth from "../../../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import { ToastContainer } from "react-toastify";
// import Box from "@mui/material/Box";
// import { DataGrid } from "@mui/x-data-grid";
import "./assets/profile.css";
import PostCard from "../../components/PostCard/PostCard.jsx";
import WorkoutGrid from "../../components/WorkoutGird/WorkoutGrid.jsx"
// import EditWorkout from '../../components/EditWorkout/EditWorkout'
import { Button } from "@mui/material";

// export for profile
const Profile = () => {
  const loggedIn = Auth.loggedIn();
  const { loading, error, data, refetch } = useQuery(QUERY_ME);

  // const { 
  //   loading: loadingComments, 
  //   error: errorComments,
  //    data: dataComments 
  //   } = useQuery(QUERY_COMMENTS)

  const login = () => {
    window.location.href = "./login";
  };
  const signUp = () => {
    window.location.href = "./signup";
  };



  //making handling data easier, but will not use for now
  // const posts = data.me.posts;
  // const workouts = data.me.workouts;
  // const username = data.me.username;
  // const userData = data.me;


  //making the users first initial capital in the post card
  const usernameInitial = (str) => {
    return str.toUpperCase();
  };

  if (loading) return <p>Loading your profile...please wait.</p>;
  if (error) <p>{error}</p>
  if (!data) return <p>Profile not found</p>;


  return (
    <div>
      {loggedIn ? (
        <div>
          <h1 className="welcomeHeader">
            Hey there, {data.me.username}, here are all of your posts and
            workouts!
          </h1>
          {data.me.posts.map((post) => (
            <PostCard
              className="PostCard"
              key={post._id}
              postId={post._id}
              postComments={post.comments.map((comment) => comment)}
              title={post.title}
              username={usernameInitial(data.me.username)}
              content={post.content}
              createdAt={data.me.createdAt}
              topicName={post.topic.map((topic) => topic.topicName)}
              showDeletePostBtn={data.me._id}
              showEditBtn={loggedIn}
              refetch={refetch}
            >
            </PostCard>
          ))}
          <WorkoutGrid />
        </div>
      ) : (
        <div className="signInOrSignupDiv">
          <p>Not already a member?</p>
          <p>
            Be sure to <Button onClick={login}> Login </Button>
            or
            <Button onClick={signUp}> sign up </Button> here.
          </p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Profile;

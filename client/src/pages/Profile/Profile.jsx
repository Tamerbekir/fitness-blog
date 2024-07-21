import Auth from "../../../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import { ToastContainer } from "react-toastify";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import "./assets/profile.css";
import PostCard from "../../components/PostCard/PostCard";

// export for profile
const Profile = () => {
  const loggedIn = Auth.loggedIn();
  const { loading, error, data, refetch } = useQuery(QUERY_ME);

  const login = () => {
    window.location.href = "./login";
  };
  const signUp = () => {
    window.location.href = "./signup";
  };

  if (loading) return <p>Loading your profile...please wait.</p>;
  if (error)
    return (
      <div>
        <p>Whoops! You need to be signed in to do that.</p>
        <p>Not already a member?</p>
        <p>
          Be sure to <button onClick={login}>Login</button> or{" "}
          <button onClick={signUp}>sign up</button> here.
        </p>
      </div>
    );
  if (!data) return <p>Profile not found</p>;

  //making handling data easier, but will not use for now
  // const posts = data.me.posts;
  // const workouts = data.me.workouts;
  // const username = data.me.username;
  // const userData = data.me;

  // Prepare the rows for DataGrid
  const rows = data.me.workouts.map((workout, index) => ({
    id: index + 1,
    weight: workout.weight,
    reps: workout.reps,
    miles: workout.miles,
    pace: workout.pace,
    notes: workout.notes,
    createdAt: workout.createdAt,
    exercises: workout.exercise.map((exercise) => exercise.exerciseName),
  }));

  const columns = [
    { field: "id", headerName: "Workout", width: 90 },
    { field: "weight", headerName: "Weight", width: 100, editable: false },
    { field: "reps", headerName: "Reps", width: 100, editable: false },
    { field: "exercises", headerName: "Exercises", width: 150, editable: true },
    { field: "miles", headerName: "Miles", width: 200, editable: false },
    { field: "pace", headerName: "Pace", width: 200, editable: false },
    { field: "notes", headerName: "Notes", width: 200, editable: false },
    { field: "createdAt", headerName: "Date", width: 200, editable: false },
  ];

  //making the users first initial capital in the post card
  const usernameInitial = (str) => {
    return str.toUpperCase();
  };

  return (
    <div>
      <div>
        <h1>
          Hey there, {data.me.username}, here are all of your posts and
          workouts!
        </h1>
        {data.me.posts.map((post) => (
          <PostCard
            className="PostCard"
            key={post._id}
            postId={post._id}
            title={post.title}
            username={usernameInitial(data.me.username)}
            content={post.content}
            createdAt={data.me.createdAt}
            topicName={post.topic.map((topic) => topic.topicName)}
            showDeleteBtn={loggedIn}
            showEditBtn={loggedIn}
            leaveComment={leaveComment}
            refetch={refetch}
          >
          </PostCard>
        ))}
        <h1>Latest workouts..</h1>
        <Box sx={{ height: 400, width: "70%" }}>
          <DataGrid
            refetch={refetch}
            className="workoutGrid"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;

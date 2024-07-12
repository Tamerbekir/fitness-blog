import Auth from '../../../utils/auth'
import { useQuery } from '@apollo/client'
import { QUERY_ME } from '../../../utils/queries'
import DateFormatPost from '../../components/DateFormat/DateFormatPost'
import DeletePost from '../../components/DeletePost/DeletePost'
import { ToastContainer } from 'react-toastify'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import './assets/profile.css'
import PostCardProfile from '../../components/PostCardProfile/PostCardProfile'

// export for profile
const Profile = () => {
  const loggedIn = Auth.loggedIn();
  const { loading, error, data, refetch } = useQuery(QUERY_ME);

  // const loginPage = () => {
  //   window.location.href = "./login";
  // };

  if (loading) return <p>Loading your profile...please wait.</p>
  if (error) return <div> <p>{error.message}</p></div>
  if (!data) return <p>Profile not found</p>

  const posts = data.me.posts;
  const workouts = data.me.workouts;

  // Prepare the rows for DataGrid
  const rows = workouts.map((workout, index) => ({
    id: index + 1,
    weight: workout.weight,
    reps: workout.reps,
    createdAt: workout.createdAt,
    exercises: workout.exercise.map(ex => ex.exerciseName)
  }));

  const columns = [
    { field: 'id', headerName: 'Workout', width: 90 },
    { field: 'weight', headerName: 'Weight', width: 100, editable: false },
    { field: 'reps', headerName: 'Reps', width: 100, editable: false },
    { field: 'exercises', headerName: 'Exercises', width: 150, editable: true },
    { field: 'createdAt', headerName: 'Date', width: 200, editable: false }
  ]

  //making the users first initial capital in the post card
  const usernameInitial = (str) => {
    return str.toUpperCase()
  }

  return (
    <div>
      {loggedIn && <p>If you can read this then user is Authenticated</p>}
      <div>
        <h1>Hey there, {data.me.username}, here are all of your posts and workouts!</h1>
        {posts.map((post) => (
          <PostCardProfile
            key={post._id}
            title={post.title}
            username={usernameInitial(data.me.username)}
            content={post.content}
            topicName={post.topic.topicName}
            createdAt={post.createdAt}
          >   
                   {/* not working for topic names */}
          {/* {post.topic.map(topic => (
            <p key={topic._id}>{topic.topicName}</p>
          ))} */}
            <DateFormatPost createdAt={post.createdAt} />
            <DeletePost postId={post._id} refetch={refetch} />
          </PostCardProfile>
        ))}
        <h1>Workouts</h1>
        <Box sx={{ height: 400, width: '70%' }}>
          <DataGrid
            className='workoutGrid'
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
      <DateFormatPost />
      <DeletePost />
    </div>
  )
}

export default Profile;

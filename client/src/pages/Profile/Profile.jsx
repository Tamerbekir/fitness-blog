import Auth from '../../../utils/auth';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../../utils/queries';
import DateFormatPost from '../../components/DateFormat/DateFormatPost';
import DeletePost from '../../components/DeletePost/DeletePost';
import { ToastContainer } from 'react-toastify'

// export for profile
const Profile = () => {
  const loggedIn = Auth.loggedIn();
  // using QUERY ME and taking in loading, error and data and also refetch
  // const { loading, error, data, refetch } = useQuery(QUERY_ME);
  const { loading, error, data, refetch } = useQuery(QUERY_ME);

  const loginPage = () => {
    window.location.href = "./login";
  };

  if (loading) return <p>Loading your profile...please wait.</p>
  if (error) return <div> <p>{error.message}</p></div>
  if (!data) return <p>Profile not found</p>

  const posts = data.me.posts
  const workouts = data.me.workouts
  const exercises = data.me.exercise

  // console.log(workout)
  
  return (
    <div>
      {loggedIn && <p>If you can read this then user is Authenticated</p>}
      <div>
        <h1>Title</h1>
        {posts.map((post) => (
        <div key={post._id}>
            <h1>{post.title}</h1>
            {post.topic.map((topic) => (
              <p key={topic}>{topic.topicName}</p>
            ))}
            <p>{post.topic.topicName}</p>
            <DeletePost postId={post._id} refetch={refetch} />
            <DateFormatPost createdAt={post.createdAt} />
          </div>
        ))}
        <p>Workout</p>
        {workouts.map(workout => (
          <div key={workout._id}>
            <h5>Weight</h5>
            <p>{workout.weight}</p>
            <h5>Reps</h5>
            <p>{workout.reps}</p>
            <h5>Exercise</h5>
            {workout.exercise.map((exercise) => (
              <p key={exercise}>{exercise.exerciseName}</p>
            ))}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;

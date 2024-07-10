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
  const { loading, error, data, refetch } = useQuery(QUERY_ME);

  const loginPage = () => {
    window.location.href = "./login";
  };

  if (loading) return <p>Loading your profile...please wait.</p>
  if (error) return <div> <p> Whoops! You need to be logged in to do that.</p><button onClick={loginPage}> Login</button></div>
  if (!data) return <p>Profile not found</p>

  const posts = data.me.posts;
  
  return (
    <div>
      {loggedIn && <p>If you can read this then user is Authenticated</p>}
      <div>
        <h1>Title</h1>
        {posts.map((post) => (
          <div key={post._id}>
            <h1>{post.title}</h1>
            {/* from the DeletePost component- the parameters we passed through, postId and refetch, will = the post._id and the refetch from the QUERY ME  */}
            <DeletePost postId={post._id} refetch={refetch} />
            <DateFormatPost createdAt={post.createdAt} />
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;

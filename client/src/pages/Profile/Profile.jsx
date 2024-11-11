import Auth from "../../../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_POSTS } from "../../../utils/queries";
import { toast } from "react-toastify";
import "./assets/profile.css";
import PostCard from "../../components/PostCard/PostCard.jsx";
import WorkoutGrid from "../../components/WorkoutGird/WorkoutGrid.jsx"
import AccessPrompt from '../../components/AccessPrompt/AccessPrompt.jsx'
import { Form } from "react-bootstrap";
import DateFormatPost from '../../components/DateFormat/DateFormatPost.jsx'
// export for profile
const Profile = () => {

  const loggedIn = Auth.loggedIn();
  const { loading, error, data, refetch } = useQuery(QUERY_ME);

  // const {
  //   loading: loadingPosts,
  //   error: errorPosts,
  //   data: dataPosts } = useQuery(QUERY_POSTS);

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
  if (!loggedIn) {
    return (
      <div>
        <Form.Label>Member Access Only</Form.Label>
        <AccessPrompt />
      </div>
    );
  }

  const formattedDate = new Date(parseInt(data.me.createdAt)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });


  return (
    <div>
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
            createdAt={formattedDate}
            topicName={post.topic.map((topic) => topic.topicName)}
            showDeletePostBtn={data.me._id}
            showEditBtn={loggedIn}
            refetch={refetch}
          >
          </PostCard>
        ))}
        <WorkoutGrid />
      </div>
    </div>
  );
}

export default Profile;

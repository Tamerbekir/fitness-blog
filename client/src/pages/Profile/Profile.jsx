import Auth from "../../../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_POSTS } from "../../../utils/queries";
import "./assets/profile.css";
import PostCard from "../../components/PostCard/PostCard.jsx";
import WorkoutGrid from "../../components/WorkoutGird/WorkoutGrid.jsx"
import AccessPrompt from '../../components/AccessPrompt/AccessPrompt.jsx'
import { Form } from "react-bootstrap";


// export for profile
const Profile = () => {

  const loggedIn = Auth.loggedIn();
  const {
    loading,
    error,
    data: dataMe,
    refetch } = useQuery(QUERY_ME);


  //making the users first initial capital in the post card
  const usernameInitial = (str) => {
    return str.toUpperCase();
  };

  if (loading) return <p>Loading your profile...please wait.</p>;
  if (error) <p>{error.message}</p>
  if (!loggedIn || !dataMe) {
    return (
      <div>
        <Form.Label>Member Access Only</Form.Label>
        <AccessPrompt />
      </div>
    );
  }

  const formattedDate = new Date(parseInt(dataMe.me.createdAt)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });


  // const userReplies = dataMe.me.posts.map((post) => post.comments.map((replies) => replies.commentReplies.map((replyContent) => replyContent.content)))

  // console.log(userReplies)



  return (
    <div>
      <div>
        {/* <h1 className="welcomeHeader">
          Hey there, {data.me.username}, here are all of your posts and
          workouts!
        </h1> */}
        {dataMe.me.posts.map((post) => (
          <div
            key={post._id}>
            <PostCard
              className="PostCard"
              key={post._id}
              postId={post._id}
              postCommentReplies={post.comments.map((replies) => replies.commentReplies.map((replyContent) => replyContent.content))}
              postComments={post.comments.map((comment) => comment)}
              title={post.title}
              username={usernameInitial(dataMe.me.username)}
              content={post.content}
              createdAt={formattedDate}
              topicName={post.topic.map((topic) => topic.topicName)}
              showDeletePostBtn={dataMe.me._id}
              showEditBtn={loggedIn}
              refetch={refetch}
            />
          </div>
        ))}
        <h4 className="favoritePostHeader">Favorite Posts</h4>
        {dataMe.me.favoritePost.map((favTitle, index) => (
          <div key={index}>
            {/* Link will go to homepage for now until post has its own dedicated route  */}
            <p className="userFavList"> <a href="/">{favTitle.title}</a></p>
          </div>
        ))}
        <WorkoutGrid />
      </div>
    </div>
  );
}

export default Profile;

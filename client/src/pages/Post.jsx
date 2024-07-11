import { useQuery } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/queries";
import Auth from '../../utils/auth';

const Post = () => {
  const loggedIn = Auth.loggedIn();

  const { loading, error, data } = useQuery(QUERY_POSTS);

  console.table(['Data for posts:', data]);
  if (loading) return <p>Loading...please wait</p>;
  if (error) return <p>Error: { error.message }</p>;
  if (!data || !data.posts) return <p>No posts found!</p>;

  return (
    <div>
      {loggedIn && (
        <p>User is logged</p>
      )}
      <h3>Posts</h3>
      {data.posts.map(post => (
        <div key={post._id}> 
          <h1>Title</h1>
          <p>{post.title}</p>
          <h2>Post</h2>
          <h5>{post.content}</h5>
          <h4>Topic</h4>
          {post.topic.map(topic => (
            <p key={topic._id}>{topic.topicName}</p>
          ))}
          {/* !Showing cannot be non nullable for profile */}
          {/* {post.profile.map(profile => (
            <p key={profile._id}>{profile.username}</p>
          ))} */}
          {/* <h4>User</h4> */}
          {/* <p>{post.profile.username}</p> */}
        </div>
      ))}
    </div>
  );
}

export default Post;

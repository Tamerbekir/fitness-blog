import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../../utils/queries";
import Auth from "../../utils/auth";
import PostCard from "../components/PostCard/PostCard";
import DeletePost from "../components/DeletePost/DeletePost";
import DateFormatPost from "../components/DateFormat/DateFormatPost";

const Home = () => {
  const loggedIn = Auth.loggedIn();

  const { loading, error, data, refetch } = useQuery(QUERY_POSTS);
  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe,
  } = useQuery(QUERY_ME);

  const usernameInitial = (str) => {
    return str.toUpperCase();
  };

  const logIn = () => {
    window.location.href = "./login";
  };
  const signUp = () => {
    window.location.href = "./signup";
  };

  // console.table(['Data for posts:', data])
  if (loading) return <p>Loading...please wait</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !dataMe)
    return (
      <div>
        <h1>Welcome to the Fitness Blog!</h1>
        <p>Not already a member?</p>
        <p>
          Be sure to <button onClick={logIn}>Login</button> or{" "}
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
            <DateFormatPost createdAt={post.createdAt} />
            {loggedIn && <DeletePost postId={post._id} refetch={refetch} />}
          </PostCard>
        ))}
      </div>
    );

  return (
    <div>
      <div>
        {loggedIn && (
          <>
            <h1 className="welcomeHomeText">
              Hey there, {dataMe.me.username}, check out the latest posts!
            </h1>
            {data.posts.map((post) => (
              <PostCard
                className="postCardHome"
                key={post._id}
                deletePostId={post._id}
                title={post.title}
                username={usernameInitial(post.profile.username)}
                content={post.content}
                createdAt={post.createdAt}
                topicName={post.topic.map((topic) => topic.topicName)}
                showDeleteBtn={loggedIn && dataMe.me._id === post.profile._id}
                refetch={refetch}
              >
                <DateFormatPost createdAt={post.createdAt} />
              </PostCard>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

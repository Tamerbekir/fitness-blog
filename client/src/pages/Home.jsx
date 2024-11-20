import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../../utils/queries";
import Auth from "../../utils/auth";
import PostCard from "../components/PostCard/PostCard.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AccessPrompt from "../components/AccessPrompt/AccessPrompt.jsx";
import { toast } from "react-toastify";
import { useSearch } from "../components/Search/SearchProvider.jsx";
import { UserProfile } from './index.js'
import { SearchBar } from "../components/index.js";
import zIndex from "@mui/material/styles/zIndex.js";
import FavoritePost from "../components/FavoritePost/FavoritePost.jsx";


const Home = () => {
  const loggedIn = Auth.loggedIn();
  const { searchKeyWord } = useSearch();

  const {
    loading: loadingPosts,
    error: errorPosts,
    data: dataPosts,
    refetch
  } = useQuery(QUERY_POSTS);

  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe
  } = useQuery(QUERY_ME);


  const usernameInitial = (str) => {
    return str.toUpperCase();
  };

  if (loadingPosts || loadingMe) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }


  const searchPosts = dataPosts.posts.filter(post => post.title.toLowerCase().includes(searchKeyWord.toLowerCase()) || post.content.toLowerCase().includes(searchKeyWord.toLowerCase()))
  // console.log('data',dataPosts)

  if (errorPosts || errorMe) {
    return <p>Error: {errorPosts.message}</p>;
  }

  if (!dataPosts || !dataMe) {
    return <p>No posts found</p>;
  }

  return (
    <div>
      <div>
        {/* <UsersProfile userIndex={userIndex} /> */}
      </div>
      <div>
        {loggedIn && dataMe && (
          <>
            <h1 className="nameHeader">Live Fit</h1>
            <SearchBar />
            <h5 className="welcomeBackText">
              Welcome back, {dataMe.me.username}.
            </h5>
            {searchPosts.map((post) => (
              <PostCard
                className="postCardHome"
                key={post._id}
                postId={post._id}
                postComments={post.comments}
                postCommentReplies={post.comments.commentReplies}
                postFavorites={post.profile.favoritePost}
                title={post.title}
                username={usernameInitial(post.profile.username)}
                content={post.content}
                createdAt={new Date(parseInt(post.createdAt)).toLocaleDateString()}
                topicName={post.topic.map((topic) => topic.topicName)}
                showYouForPost={dataMe.me._id === post.profile._id}
                showDeletePostBtn={dataMe.me._id === post.profile._id}
                showEditBtn={dataMe.me._id === post.profile._id}
                refetch={refetch}
              />
            ))}
          </>
        )}
      </div>
      <div>
        {!loggedIn && (
          <div>
            <h1 className="welcomeHomeText">Live Fit</h1>
            <AccessPrompt />
            {searchPosts.map((post) => (
              <PostCard
                className="PostCard"
                key={post._id}
                title={post.title}
                postComments={post.comments}
                username={usernameInitial(post.profile.username)}
                content={post.content}
                createdAt={new Date(parseInt(post.createdAt)).toLocaleDateString()}
                topicName={post.topic.map((topic) => topic.topicName)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

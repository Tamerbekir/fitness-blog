import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../../utils/queries"
import Box from '@mui/material/Box';
import Auth from '../../utils/auth';
import PostCardHome from "../components/PostCardHome/PostCardHome";
import DeletePost from "../components/DeletePost/DeletePost";
import DateFormatPost from "../components/DateFormat/DateFormatPost";

const Home = () => {
  const loggedIn = Auth.loggedIn();

  const { loading, error, data, refetch } = useQuery(QUERY_POSTS)
  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME)

  // console.table(['Data for posts:', data])
  if (loading) return <p>Loading...please wait</p>
  if (error) return <p>Error: {error.message}</p>
  if (!data || !dataMe) return <p>No posts found!</p>

  const usernameInitial = (str) => {
    return str.toUpperCase()
  }


  return (
    <div>
      <div>
        <h1 className="welcomeHomeText" >Hey there, {dataMe.me.username}, check out the latest posts!</h1>
        {data.posts.map((post) => (
          <PostCardHome
            className='postCardHome'
            key={post._id}
            title={post.title}
            username={usernameInitial(post.profile.username)}
            content={post.content}
            createdAt={post.createdAt}
          >
            <DateFormatPost createdAt={post.createdAt} />
            <DeletePost postId={post._id} refetch={refetch} />
          </PostCardHome>
        ))}
      </div>
    </div>
  )
}



export default Home

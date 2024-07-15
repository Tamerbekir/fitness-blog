import {
  useState,
  useQuery, useMutation,
  QUERY_ME, QUERY_TOPICS,
  ADD_POST,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  ToastContainer, toast, Bounce,
  Auth
} from './createPost'

import './assets/createPost.css'


const CreatePost = () => {
  // used for testing purposes
  const loggedIn = Auth.loggedIn()

  // Bringing in QUERY ME. Used property values to define bringing in data from 'me' query so it does not conflict with other queries. For example, in most cases it would be loading, error and data.
  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe } = useQuery(QUERY_ME)

  // Bringing in QUERY for topics
  const {
    loading: loadingTopics,
    error: errorTopics,
    data: dataTopics, 
    refetch } = useQuery(QUERY_TOPICS)

  // adding mutation to add a post
  const [addPost] = useMutation(ADD_POST)

  // redirect function that sends user to the profile page after post is made
  // const redirect = () => {
  //   window.location.href = './profile'
  // }

  // useState for creating a post
  const [addPostInfo, setAddPostInfo] = useState({
    title: '',
    content: '',
    topic: ''
  })

  const [viewPostForm, setViewPostForm] = useState(false)

  // handling the viewPost button
  const handleViewPost = () => {
    window.location.href = './profile'
  }

  // function for handling the change when a post is made, taking in useState name and values
  const handleAddPostChange = (event) => {
    const { name, value } = event.target;
    setAddPostInfo({
      ...addPostInfo,
      [name]: value
    })
  }

  // adding mutation to function to create a post and taking in useState variables
  const handleAddPost = async () => {
    try {
      await addPost({
        variables: {
          title: addPostInfo.title,
          content: addPostInfo.content,
          topic: addPostInfo.topic
        }
      });
      // console.log('Post added');
       // once posted,show success
      toast.success('Posted!', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
      //show the view post form/button once post is made
      setViewPostForm(true)
    } catch (error) {
      toast.error('There was an issue creating your post. Please check the fields and try again.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
      console.error('There was an error creating this post:', error);
    }
  }

  // function for going to login page
  const loginPage = () => {
    window.location.href = './login'
  }

  // handling all loading for query Me and query topics
  if (loadingMe || loadingTopics) return <p>Loading your post creation...</p>
  if (errorMe || errorTopics) return <div> <p>Whoops! You need to be logged in to do that.</p></div>
  if (!dataMe || !dataTopics) return <p>Profile not found to create post</p>


  return (
    <div>
      {!loggedIn && (
        <button onClick={loginPage}>Login</button>
      )}

      <form>
        <div className="userTitleDiv">
          <TextField
            className='userTitle'
            type='text'
            name='title'
            value={addPostInfo.title}
            onChange={handleAddPostChange}
            label='Title'
            variant="filled"
          />
        </div>
        <div className="userPostDiv">
          <TextField
            minRows={15}
            multiline
            className='userPost'
            type='text'
            name='content'
            value={addPostInfo.content}
            onChange={handleAddPostChange}
            label='Post'
            variant="filled"
          />
        </div>
        <div className="userTopicDiv">
          <FormControl variant="filled" className='userTopicForm'>
            <InputLabel id="topic-label">Topic</InputLabel>
            <Select
              labelId="topic-label"
              id="topic-select"
              value={addPostInfo.topic}
              name='topic'
              onChange={handleAddPostChange}
              label="Topic"
            >
              <MenuItem className='userTopicForm'>
              </MenuItem>
              {/* Mapping over dataTopics with 'topics' from QUERY TOPICS */}
              {dataTopics.topics.map((topic) => (
                // key will be the name we defined here (topic) along with its ._id which comes from Mongoose Atlas collection 
                <MenuItem key={topic._id} value={topic.topicName}>
                  {/* We make the value the defined value (topic) with the topicName, from the QUERY TOPICS */}
                  {topic.topicName}
                  {/* We then display the topic names */}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select a topic for your post</FormHelperText>
          </FormControl>
        </div>
        <button type='button' refetch={refetch} onClick={handleAddPost}>Add Post</button>
        {viewPostForm && (
          <button type='button' onClick={handleViewPost} >View Posts</button>
        )}
      </form>
      <ToastContainer />
    </div>
  )
}

export default CreatePost

import {
  useState,
  useQuery, useMutation,
  QUERY_ME, QUERY_TOPICS,
  ADD_POST,
  Auth,
  Button,
  AccessPrompt,
  ReactQuill
} from './createPost';
import { Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-quill/dist/quill.snow.css'
import './assets/createPost.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { QUERY_POSTS } from '../../../utils/queries';
import OrbitProgress from 'react-loading-indicators';



const CreatePost = () => {
  // used for testing purposes
  const loggedIn = Auth.loggedIn();

  const navigate = useNavigate()

  // Bringing in QUERY ME. Used property values to define bringing in data from 'me' query so it does not conflict with other queries. For example, in most cases it would be loading, error and data.
  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe,
    refetch: refetchMe
  } = useQuery(QUERY_ME);

  // Bringing in QUERY for topics
  const {
    loading: loadingTopics,
    error: errorTopics,
    data: dataTopics,
  } = useQuery(QUERY_TOPICS);

  const {
    loading: loadingPosts,
    error: errorPosts,
    data: dataPosts,
    refetch: refetchPosts
  } = useQuery(QUERY_POSTS)


  // adding mutation to add a post
  const [addPost] = useMutation(ADD_POST);

  // redirect function that sends user to the profile page after post is made
  // const redirect = () => {
  //   window.location.href = './profile'
  // }

  // useState for creating a post
  const [addPostInfo, setAddPostInfo] = useState({
    title: '',
    content: '',
    topic: ''
  });

  const [viewPostForm, setViewPostForm] = useState(false);

  // handling the viewPost button which is not yet implememnted
  const handleViewPost = () => {
    navigate('/profile')
  };


  // function for handling the change when a post is made, taking in useState name and values
  const handleAddPostChange = (event) => {
    const { name, value } = event.target;
    setAddPostInfo({
      ...addPostInfo,
      [name]: value
    });
  };

  //adding for quill as chnage is applied to the users content
  const handleReactQuillChnage = (value) => {
    setAddPostInfo({
      ...addPostInfo,
      content: value
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
      refetchPosts()
      toast.success('Posted!')
      navigate('/')
      setViewPostForm(true);
      // show the view post form/button once post is made
    } catch (error) {
      toast.error('An Error Ocurred')
      console.error('There was an error creating this post:', error);
    }
  };


  // handling all loading for query Me and query topics
  if (loadingMe || loadingTopics || loadingPosts)
    return
  <p>
    <OrbitProgress
      variant="spokes"
      color="#32cd32"
      size="large"
      text=""
      textColor="#c85f5f" />
  </p>;
  if (errorMe || errorTopics || errorPosts) return <div><p>Whoops! You need to be logged in to do that.</p></div>;
  if (!dataTopics) return <p>Profile not found to create post</p>;

  if (!loggedIn) {
    return (
      <div>
        <Form.Label>Member Access Only</Form.Label>
        <AccessPrompt />
      </div>
    )
  }

  return (
    <Container>
      <Form>
        <Form.Group className="userTitleDiv mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={addPostInfo.title}
            onChange={handleAddPostChange}
            className="userTitle"
          />
        </Form.Group>
        <Form.Group className="userPostDiv mb-3">
          <Form.Label>Post</Form.Label>
          <ReactQuill
            // as="textarea"
            // rows={15}
            // name="content"
            value={addPostInfo.content}
            onChange={handleReactQuillChnage}
            className="userPost"
            theme='snow'
          />
        </Form.Group>
        <Form.Group className="userTopicDiv mb-3">
          <Form.Label>Topic</Form.Label>
          <Form.Select
            value={addPostInfo.topic}
            name="topic"
            onChange={handleAddPostChange}
            className="userTopicForm"
          >
            <option value="" disabled>Select a topic</option>
            {dataTopics.topics.map((topic) => (
              <option key={topic._id} value={topic.topicName}>
                {topic.topicName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="button" className='addPostBtn' onClick={handleAddPost}>
          Add Post
        </Button>
        {viewPostForm && (
          <Button variant="primary" type="button" onClick={handleViewPost} className="ms-2 viewPostBtn">
            View Posts
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default CreatePost;

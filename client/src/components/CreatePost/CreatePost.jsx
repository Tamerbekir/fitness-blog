import {
  useState,
  useQuery, useMutation,
  QUERY_ME, QUERY_TOPICS,
  ADD_POST,
  ToastContainer, toast, Bounce,
  Auth,
  Button
} from './createPost';
import { Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/createPost.css';

const CreatePost = () => {
  // used for testing purposes
  const loggedIn = Auth.loggedIn();

  // Bringing in QUERY ME. Used property values to define bringing in data from 'me' query so it does not conflict with other queries. For example, in most cases it would be loading, error and data.
  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe
  } = useQuery(QUERY_ME);

  // Bringing in QUERY for topics
  const {
    loading: loadingTopics,
    error: errorTopics,
    data: dataTopics,
    refetch
  } = useQuery(QUERY_TOPICS);

  // function for going to login page
  const login = () => {
    window.location.href = './login';
  };

  const signup = () => {
    window.location.href = '/signup';
  };

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

  // handling the viewPost button
  const handleViewPost = () => {
    window.location.href = './profile';
  };

  // function for handling the change when a post is made, taking in useState name and values
  const handleAddPostChange = (event) => {
    const { name, value } = event.target;
    setAddPostInfo({
      ...addPostInfo,
      [name]: value
    });
  };

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
      // once posted, show success
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
      });
      // show the view post form/button once post is made
      setViewPostForm(true);
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
      });
      console.error('There was an error creating this post:', error);
    }
  };

  // handling all loading for query Me and query topics
  if (loadingMe || loadingTopics) return <p>Loading your post creation...</p>;
  if (errorMe || errorTopics) return <div><p>Whoops! You need to be logged in to do that.</p></div>;
  if (!dataTopics) return <p>Profile not found to create post</p>;

  if (!dataMe.me) {
    return (
      <div className="signInOrSignupDiv">
        <p>Want to leave a post?</p>
        <p>
          Be sure to <Button onClick={login}>Login</Button>
          or
          <Button onClick={signup}>sign up</Button> here.
        </p>
      </div>
    );
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
          <Form.Control
            as="textarea"
            rows={15}
            name="content"
            value={addPostInfo.content}
            onChange={handleAddPostChange}
            className="userPost"
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
      <ToastContainer />
    </Container>
  );
};

export default CreatePost;

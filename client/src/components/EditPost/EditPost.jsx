import { QUERY_ME } from "../../../utils/queries";
import { QUERY_TOPICS } from "../../../utils/queries";
import { UPDATE_POST } from "../../../utils/mutations";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Form, Button, Container } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import './assets/editPost.css'

const EditPost = ({ postId }) => {
  const {
    loading: loadingTopics,
    error: errorTopics,
    data: dataTopics,
    refetch,
  } = useQuery(QUERY_TOPICS);

  const { loading, error, data } = useQuery(QUERY_ME);

  const [editPost] = useMutation(UPDATE_POST, {
    onCompleted: () => refetch(),
    onError: (error) => console.error("Error editing post"),
  });

  const [editPostFormBtn, setEditPostFormBtn] = useState(false);
  const [viewPostForm, setViewPostForm] = useState(false);
  const [editPostInfo, setEditPostInfo] = useState({
    title: "",
    content: "",
    topic: "",
  });

  useEffect(() => {
    if (data) {
      const post = data.me.posts.find((post) => post._id === postId);
      if (post) {
        setEditPostInfo({
          id: postId,
          title: post.title,
          content: post.content,
        });
      }
    }
  }, [data, postId]);

  const handlePostChange = (event) => {
    const { name, value } = event.target;
    setEditPostInfo({
      ...editPostInfo,
      [name]: value,
    });
  };

  const handleEditPostChange = async () => {
    try {
      await editPost({
        variables: {
          ...editPostInfo,
          title: editPostInfo.title,
          content: editPostInfo.content,
          topic: editPostInfo.topic,
        },
      });
      setViewPostForm(true);
    } catch (error) {
      console.error("There was an error editing post:", error);
    }
    console.log(
      "title:",
      editPostInfo.title,
      "content:",
      editPostInfo.content,
      "topic:",
      editPostInfo.topic
    );
  };

  const handleViewPost = () => {
    window.location.href = "./profile";
  };

  if (loading || loadingTopics) return <p>Loading your post creation...</p>;
  if (error || errorTopics)
    return (
      <div>
        <p>Whoops! You need to be logged in to do that.</p>
      </div>
    );
  if (!data || !dataTopics) return <p>Profile not found to create post</p>;

  return (
    <Container>
      {editPostFormBtn && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={editPostInfo.title}
              onChange={handlePostChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Post</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={editPostInfo.content}
              onChange={handlePostChange}
            />
          </Form.Group>
          <Form.Label>Topic</Form.Label>
          <Form.Group className="mb-3">
            <Form.Select
              value={editPostInfo.topic}
              name="topic"
              onChange={handlePostChange}
            >
              <option value="">Topic</option>
              {dataTopics.topics.map((topic) => (
                <option key={topic._id} value={topic.topicName}>
                  {topic.topicName}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Select a topic for your post
            </Form.Text>
          </Form.Group>
          <Button
            className="me-2 updatePostBtn"
            type="button"
            onClick={handleEditPostChange}
          >
            Update Post
          </Button>
          <Button
            className="cancelEditBtn"
            onClick={() => setEditPostFormBtn(false)}
          >Cancel
          </Button>
          {viewPostForm && (
            <Button type="button" onClick={handleViewPost}>
              View Posts
            </Button>
          )}
        </Form>
      )}
      {!editPostFormBtn && (
        <>
          <IconButton type="button" onClick={() => setEditPostFormBtn(true)}>
            <EditIcon className="editPostBtn" />
          </IconButton>
        </>
      )}
      {/* <ToastContainer /> */}
    </Container>
  );
};

export default EditPost;

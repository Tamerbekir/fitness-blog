import { QUERY_ME, QUERY_POSTS } from "../../../utils/queries";
import { QUERY_TOPICS } from "../../../utils/queries";
import { UPDATE_POST } from "../../../utils/mutations";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { Form, Button, Container } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import 'react-quill/dist/quill.snow.css'
import DeletePost from '../DeletePost/DeletePost.jsx'
import 'react-toastify/dist/ReactToastify.css';


import ReactQuill from "react-quill";
import "./assets/editPost.css";

const EditPost = ({ postId }) => {
  const {
    loading: loadingTopics,
    error: errorTopics,
    data: dataTopics,
    refetch,
  } = useQuery(QUERY_TOPICS);

  const {
    loading: loadingPosts,
    error: errorPosts,
    data: dataPosts
   } = useQuery(QUERY_POSTS)

  const { loading, error, data } = useQuery(QUERY_ME);

  // const postTopics = dataPosts.posts.map(post => post.topic)
  // console.log(postTopics)

  const [editPost] = useMutation(UPDATE_POST, {
    onCompleted: () => refetch(),
  });

  const [editPostForm, setEditPostForm] = useState(false);
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
      console.log(post.title)
    }
  }, [data, postId]);

  const handlePostChange = (event) => {
    const { name, value } = event.target;
    setEditPostInfo({
      ...editPostInfo,
      [name]: value,
    });
  };

  //adding for quill as chnage is applied to the users content
  const handleReactQuillChnage = (value) => {
    setEditPostInfo({
      ...editPostInfo,
      content: value,
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
      toast.success('Post updated successfully!')
      setEditPostForm(false)
    } catch (error) {
      toast.error('Please Check Fields and try again.')
      setEditPostForm(true)
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
      {editPostForm && (
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
            <ReactQuill
              value={editPostInfo.content}
              onChange={handleReactQuillChnage}
              theme="snow"
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
            onClick={() => setEditPostForm(false)}
          >
            Cancel
          </Button>
          <div className="deleteIconDiv">
          <DeletePost
            postId={postId}
            refetch={refetch}
          />
          </div>
          {/* {viewPostForm && (
            <Button type="button" onClick={handleViewPost}>
              View Posts
            </Button>
          )} */}
        </Form>
      )}
      {!editPostForm && (
        <>
          <IconButton type="button" onClick={() => setEditPostForm(true)}>
            <EditIcon className="editPostBtn" />
          </IconButton>
        </>
      )}
    </Container>
  );
};

export default EditPost;

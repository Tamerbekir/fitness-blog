import { QUERY_ME } from "../../../utils/queries"
import { QUERY_TOPICS } from "../../../utils/queries";
import { UPDATE_POST } from "../../../utils/mutations"
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { useState } from "react";
// import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect } from "react"
import { useQuery, useMutation } from '@apollo/client';
import { ToastContainer, toast, Bounce } from 'react-toastify'
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Accordion from '@mui/material/Accordion';


const EditPost = ({ postId }) => {
  const {
    loading: loadingTopics,
    error: errorTopics,
    data: dataTopics, refetch } = useQuery(QUERY_TOPICS)

  const {
    loading,
    error,
    data, } = useQuery(QUERY_ME)

  const [editPost] = useMutation(UPDATE_POST, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('error editing post')
  })

  const [editPostFormBtn, setEditPostFormBtn] = useState(false)
  const [viewPostForm, setViewPostForm] = useState(false)
  const [editPostInfo, setEditPostInfo] = useState({
    title: '',
    content: '',
    topic: '',
  })

  // mapping through the data me QUERY to get to posts that way the post content can show when clicking on the edit button
  useEffect(() => {
    if (data) {
      const post = data.me.posts.find((post) => post._id === postId);
      // const postTopic = post.topic.map((topic) => topic.topicName)
      if (post) {
        setEditPostInfo({
          id: postId,
          title: post.title,
          content: post.content,
          // topic: postTopic
        });
      }
    }
  }, [data, postId]);

  const handlePostChange = (event) => {
    const { name, value } = event.target
    setEditPostInfo({
      ...editPostInfo,
      [name]: value
    })
  }

  // const handleEditForm = () => {
  //   setEditPostInfo(true)
  // }

  const handleEditPostChange = async () => {
    try {
      const { data: userEditPost } = await editPost({
        variables: {
          ...editPostInfo,
          title: editPostInfo.title,
          content: editPostInfo.content,
          topic: editPostInfo.topic,
        }
      })
      setViewPostForm(true)
      // setEditPostForm(true)
    } catch (error) {
      console.error('There was an error editing post:', error)
    }
    console.log("title:", editPostInfo.title, "content:", editPostInfo.content, "topic:", editPostInfo.topic)
  }

  const handleViewPost = () => {
    window.location.href = './profile'
  }

  if (loading || loadingTopics) return <p>Loading your post creation...</p>
  if (error || errorTopics) return <div> <p>Whoops! You need to be logged in to do that.</p></div>
  if (!data || !dataTopics) return <p>Profile not found to create post</p>



  return (
    <div>
      {editPostFormBtn && (
        <form>
          <div className="userTitleDiv">
            <TextField
              className='userTitle'
              type='text'
              name='title'
              value={editPostInfo.title}
              onChange={handlePostChange}
              label='Update Title'
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
              value={editPostInfo.content}
              onChange={handlePostChange}
              label='Update Post'
              variant="filled"
            />
          </div>
          <div className="userTopicDiv">
            <FormControl variant="filled" className='userTopicForm'>
              <InputLabel id="topic-label">Update Topic</InputLabel>
              <Select
                labelId="topic-label"
                id="topic-select"
                value={editPostInfo.topic}
                name='topic'
                onChange={handlePostChange}
                label="Topic"
              >
                <MenuItem className='userTopicForm'>
                </MenuItem>
                {dataTopics.topics.map((topic) => (
                  <MenuItem key={topic._id} value={topic.topicName}>
                    {topic.topicName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a topic for your post</FormHelperText>
            </FormControl>
            <button type='button' onClick={handleEditPostChange} refetch={refetch} >Add Post</button>
          </div>
          <div>

          </div>
          {viewPostForm && (
            <button type='button' onClick={handleViewPost} >View Posts</button>
          )}
        </form>
      )}
      {!editPostFormBtn && (
        <>
          <IconButton type='button' onClick={() => setEditPostFormBtn(true)}>
            <EditIcon className="editPostBtn" />
          </IconButton>
        </>
      )}
      {/* <ToastContainer /> */}
    </div>
  )

}

export default EditPost
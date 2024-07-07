import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_TOPICS } from '../../../utils/queries';
import { ADD_POST } from '../../../utils/mutations';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Auth from '../../../utils/auth'

import './assets/createPost.css'

const CreatePost = () => {
  const loggedIn = Auth.loggedIn()

  const { 
    loading: loadingMe, 
    error: errorMe, 
    data: dataMe } = useQuery(QUERY_ME)

  const { 
    loading: loadingTopics, 
    error: errorTopics, 
    data: dataTopics } = useQuery(QUERY_TOPICS)

  const [addPost] = useMutation(ADD_POST)

  const redirect = () => {
    window.location.href = './profile'
  }

  const [addPostInfo, setAddPostInfo] = useState({
    title: '',
    content: '',
    topic: ''
  })

  const handleAddPostChange = (event) => {
    const { name, value } = event.target;
    setAddPostInfo({
      ...addPostInfo,
      [name]: value
    })
  }

  const handleAddPost = async () => {
    try {
      await addPost({
        variables: {
          title: addPostInfo.title,
          content: addPostInfo.content,
          topic: addPostInfo.topic
        }
      });
      redirect()
      console.log('Post added');
    } catch (error) {
      console.error('There was an error creating this post:', error);
    }
  }

  const loginPage = () => {
    window.location.href = './login'
  }

  if (loadingMe || loadingTopics) return <p>Loading your post creation...</p>
  if (errorMe || errorTopics) return <div> <p>Whoops! You need to be logged in to do that.</p></div>
  if (!dataMe || !dataTopics) return <p>Profile not found to create post</p>

  // const topics = dataTopics.topics

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
                <em>Select a topic</em>
              </MenuItem>
              {dataTopics.topics.map((topic) => (
                <MenuItem key={topic._id} value={topic.topicName}>
                  {topic.topicName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select a topic for your post</FormHelperText>
          </FormControl>
        </div>
        <button type='button' onClick={handleAddPost}>Add Post</button>
      </form>
    </div>
  )
}

export default CreatePost

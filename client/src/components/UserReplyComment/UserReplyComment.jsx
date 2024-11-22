import './assets/userReplyComment.css'
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_COMMENTS } from '../../../utils/queries'
import { useMutation } from '@apollo/client';
import Auth from '../../../utils/auth';
import { REPLY_TO_COMMENT } from '../../../utils/mutations';
import { useState } from 'react';
import { TextField } from '@mui/material';
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify';





export default function userReplyComment({ commentId, refetch }) {



  const loggedIn = Auth.loggedIn()

  const [addReplyCommentForm, setAddReplyCommentForm] = useState(false)




  const {
    data: dataMe,
    loading: loadingMe,
    error: errorMe } = useQuery(QUERY_ME)

  const {
    data: loadingComments,
    loading: loadingPost,
    error: errorComments
  } = useQuery(QUERY_COMMENTS)



  const [replyToComment] = useMutation(REPLY_TO_COMMENT, {
    onCompleted: () => refetch()
  })

  const [addReplyCommentInfo, setAddReplyInfo] = useState({
    content: ''
  })

  const handleAddReplyCommentChange = (event) => {
    const { name, value } = event.target
    setAddReplyInfo({
      ...addReplyCommentInfo,
      [name]: value
    })
  }

  const handleAddReplyComment = async () => {
    try {
      if (!addReplyCommentInfo.content) {
        toast.error('Cannot leave blank')
      }
      await replyToComment({
        variables: {
          commentId,
          content: addReplyCommentInfo.content
        }
      })
      setAddReplyInfo({ content: '' })
      setAddReplyCommentForm(false)
      console.log(commentId)
    } catch (error) {
      console.error('There was an error replying to comment')
    }
  }


  if (!dataMe || !loadingComments) return <p>No profile found or posts</p>
  if (loadingMe || loadingPost) return <p>Loading..please wait</p>
  if (errorMe || errorComments) return <p>{errorMe}</p>

  return (
    <div>
      <FontAwesomeIcon
        onClick={() => setAddReplyCommentForm(!addReplyCommentForm)}
        className='commentReplyIcon'
        icon={faReply} />
      <div>
        {addReplyCommentForm ?
          <>
            <TextField
              name="content"
              label='Reply to comment'
              value={addReplyCommentInfo.content}
              type='text'
              onChange={handleAddReplyCommentChange}
              multiline
              rows={2}
              variant="filled"
              fullWidth
              refetch={refetch}
            >
            </TextField>
            <Button className='commentReplyBtn' onClick={handleAddReplyComment}>Post</Button>
          </>
          : ''}

      </div>
    </div>
  )
}
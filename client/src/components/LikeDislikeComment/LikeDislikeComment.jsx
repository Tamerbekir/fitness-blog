import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { LIKE_COMMENT } from '../../../utils/mutations'
import { DISLIKE_COMMENT } from '../../../utils/mutations'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QUERY_ME, QUERY_POSTS } from '../../../utils/queries';
import { QUERY_COMMENTS } from '../../../utils/queries';
import Button from 'react-bootstrap/Button';

{/* <FontAwesomeIcon icon={faThumbsUp} />
<FontAwesomeIcon icon={faThumbsDown} /> */}

import './assets/likeDislikeComment.css'

export default function LikeDislikeComment({ postComments, commentId, replyId, refetch }) {

  const { data: dataMe, loading: loadingMe, error: errorMe } = useQuery(QUERY_ME)


  const [likeComment] = useMutation(LIKE_COMMENT, {
    onCompleted: () => refetch()
  })
  const [dislikeComment] = useMutation(DISLIKE_COMMENT, {
    onCompleted: () => refetch()
  })


  const handleLikeComment = async () => {
    try {
      await likeComment({
        variables: {
          commentId,
          replyId
        }
      })
      console.log('Liked comment!', commentId)
    } catch (error) {
      console.error('there was an error liking comment', error)
    }
  }

  const handleDislikeComment = async () => {
    try {
      await dislikeComment({
        variables: {
          commentId,
          replyId
        }
      })
      console.log('Disliked Comment!', commentId)
    } catch (error) {
      console.error('there was an error disliking comment', error)
    }
  }

  if (loadingMe) return <p>Loading comments...please wait</p>;
  if (errorMe) return <p>Error: {errorMe.message}</p>;
  if (!dataMe) return <p>No comments found!</p>;

  return (
    <div className="likeDislikeDiv">
      <FontAwesomeIcon
        icon={faThumbsUp}
        style={{ cursor: "pointer" }}
        onClick={handleLikeComment}
      />
      <br />
      <FontAwesomeIcon
        icon={faThumbsDown}
        style={{ cursor: "pointer" }}
        onClick={handleDislikeComment}
      />
    </div>

  );
}
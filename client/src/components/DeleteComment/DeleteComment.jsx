import { useQuery, useMutation } from "@apollo/client";
// import { useState } from "react";
import { QUERY_ME, QUERY_COMMENTS } from "../../../utils/queries";
import { REMOVE_COMMENT } from "../../../utils/mutations";
import { Button } from "@mui/material";
import { toast } from 'react-toastify'
import { useState } from "react";
// import { useLongPress } from 'use-long-press';
import './assets/deleteComment.css'


const DeleteComment = ({ commentId, refetch }) => {

  const [removeComment] = useMutation(REMOVE_COMMENT, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('error removing comments', error)
  })

  const [confirmDelete, setConfirmDelete] = useState(false)

  // const onLongPress = () => {
  //   setConfirmDelete(true)
  // }

  // const longPressProps = useLongPress(onLongPress, { threshold: 500 });




  const handleDeleteComment = async () => {
    try {
      await removeComment({
        variables: {
          id: commentId
        }
      })
      toast.success('Comment Deleted')
    } catch (error) {
      toast.error('Error Deleting Comment')
      console.error('There was an error deleting your comment', error)
    }
  }
  return (
    // <div {...longPressProps}>
    <div >
      <div>
        {!confirmDelete ? (
          <Button className="deleteCommentBtn" type='button' onClick={() => setConfirmDelete(true)}>Delete</Button>
        ) : (
          <>
            <p>Are you sure you want to delete your comment?</p>
            <Button className="confirmDeleteBtn" type="button" onClick={handleDeleteComment}>Confirm Delete</Button>
            <Button className="closeConfirmDeleteBtn" type="button" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          </>
        )}
      </div>
    </div >
  )
}

export default DeleteComment
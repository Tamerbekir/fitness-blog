import { useQuery, useMutation } from "@apollo/client";
// import { useState } from "react";
import { QUERY_ME, QUERY_COMMENTS } from "../../../utils/queries";
import { REMOVE_COMMENT } from "../../../utils/mutations";
import { Button } from "@mui/material";
import { toast, Bounce } from 'react-toastify'


const DeleteComment = ({ commentId, refetch }) => {

  const {
    loading: loadingMe,
    data: dataMe,
    error: errorMe
  } = useQuery(QUERY_ME)

  const {
    loading: loadingComments,
    data: dataComments,
    error: errorComments
  } = useQuery(QUERY_ME)

  const [removeComment] = useMutation(REMOVE_COMMENT, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('error removing comments', error)
  })

  // const [removeCommentInfo, setRemoveCommentInfo] = useState()



  const handleDeleteComment = async () => {
    try {
      await removeComment({
        variables: {
          id: commentId
        }
      })
      toast.success('Comment Deleted', {
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
    } catch (error) {
      console.error('There was an error deleting your comment', error)
    }
  }
  return (
    <div>
      <Button type='button' onClick={handleDeleteComment}>Delete</Button>
    </div >
  )
}

export default DeleteComment
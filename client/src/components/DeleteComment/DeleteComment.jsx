import { useQuery, useMutation } from "@apollo/client";
// import { useState } from "react";
import { QUERY_ME } from "../../../utils/queries";
import { REMOVE_COMMENT } from "../../../utils/mutations";
import { Button } from "@mui/material";

const DeleteComment = ({ commentId }) => {

  const { 
    loading: loadingMe, 
    data: dataMe, 
    error: errorMe, 
    refetch } = useQuery(QUERY_ME, {
    onCompleted: () => refetch(),
    // onError:() => console.error('there was an error')
  })

  const [removeComment] = useMutation(REMOVE_COMMENT)

  // const [removeCommentInfo, setRemoveCommentInfo] = useState()

  const handleDeleteComment = async () => {
    try {
      await removeComment({
        variables: {
          id: commentId
        }
      })
    } catch (error) {
      console.error('There was an error deleting your comment', error)
    }
  }
  return (
    <div>
      <Button type='button' onClick={handleDeleteComment}>Delete</Button>
    </div>
  )
}

export default DeleteComment
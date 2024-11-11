import { useMutation, useQuery } from "@apollo/client";
import { ADD_COMMENT } from "../../../utils/mutations";
import { QUERY_COMMENTS, QUERY_ME } from "../../../utils/queries";
import { Button } from "@mui/material";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { toast, Bounce } from 'react-toastify'



const AddComment = ({ postId, refetch }) => {


  const {
    loading: loadingComments,
    error: errorComments,
    data: dataComments
  } = useQuery(QUERY_COMMENTS);

  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe
  } = useQuery(QUERY_ME);

  if (loadingComments || loadingMe) return <p>Loading comments...</p>;
  if (errorComments || errorMe) return <p>{errorComments.message}</p>;
  if (!dataComments) return <p>No comment data found</p>;

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: () => refetch(),
  });

  const [addCommentInfo, setAddCommentInfo] = useState({
    content: ''
  });

  const handleAddCommentChange = (event) => {
    const { name, value } = event.target;
    setAddCommentInfo({
      ...addCommentInfo,
      [name]: value
    });
  };

  const handleAddComment = async () => {
    try {
      await addComment({
        variables: {
          postId,
          content: addCommentInfo.content
        }
      });
      setAddCommentInfo({
        content: ''
      });
      console.log('comment added->', addCommentInfo.content);
      toast.success('Comment posted')
    } catch (error) {
      toast.error('Error posting comment')
      console.error('There was an issue adding the comment:', error);
    }
  };




  return (
    <div>
      {!dataMe.me ? <div><a href="/login">Login</a> or  <a href="/signup">sign up</a> to leave a comment</div> :
        <div>
          <TextField
            name="content"
            label="Add a comment"
            value={addCommentInfo.content}
            type="text"
            onChange={handleAddCommentChange}
            multiline
            rows={4}
            variant="filled"
            fullWidth
            refetch={refetch}
          />
          <Button onClick={handleAddComment} refetch={refetch} >Submit</Button>
        </div>}
    </div>
  );
};



export default AddComment;

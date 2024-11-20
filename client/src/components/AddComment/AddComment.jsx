import { useMutation, useQuery } from "@apollo/client";
import { ADD_COMMENT } from "../../../utils/mutations";
import { QUERY_ME } from "../../../utils/queries";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

const AddComment = ({ postId, refetch }) => {
  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe
  } = useQuery(QUERY_ME);

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
    if (!addCommentInfo.content) {
      toast.error("Comment cannot be empty")
      return
    }

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
  if (loadingMe) return <p>Loading comments...</p>
  if (errorMe) return <p>Error: {errorMe.message}</p>


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
          />
          <Button onClick={handleAddComment}>Submit</Button>
        </div>}
    </div>
  );
};

export default AddComment;

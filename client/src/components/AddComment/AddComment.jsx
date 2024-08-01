import { useMutation, useQuery } from "@apollo/client";
import { ADD_COMMENT } from "../../../utils/mutations";
import { QUERY_COMMENTS } from "../../../utils/queries";
import { Button } from "@mui/material";
import { useState } from "react";
import TextField from "@mui/material/TextField";

const AddComment = ({ postId }) => {
  const {
    loading: loadingComments,
    error: errorComments,
    data: dataComments,
    refetch } = useQuery(QUERY_COMMENTS);

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
    } catch (error) {
      console.error('There was an issue adding the comment:', error);
    }
  };

  if (loadingComments) return <p>Loading comments...</p>;
  if (errorComments) return <p>{errorComments.message}</p>;
  if (!dataComments) return <p>No comment data found</p>;

  return (
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
    </div>
  );
};

export default AddComment;

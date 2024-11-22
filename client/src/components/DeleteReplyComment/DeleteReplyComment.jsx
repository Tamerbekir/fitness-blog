import { useMutation } from "@apollo/client";
import { REMOVE_REPLY_TO_COMMENT } from "../../../utils/mutations";
import Button from "react-bootstrap/Button";
import './assets/deleteReplyComment.css'

export default function DeleteReplyComment({ commentId, refetch, replyId }) {
  const [removeReplyComment] = useMutation(REMOVE_REPLY_TO_COMMENT, {
    onCompleted: () => {
      refetch()
      console.log("Reply deleted");
    },
    onError: (error) => {
      console.error("error deleting reply:", error);
    },
  });

  const handleRemoveReplyComment = async () => {
    try {
      await removeReplyComment({
        variables: {
          commentId,
          replyId,
        },
      });
      // console.log("Comment ID:", commentId);
      // console.log("Reply ID:", replyId);
    } catch (error) {
      console.error("There was an error removing the reply:", error);
    }
  };

  return (
    <div>
      <Button className="deleteCommentReplyBtn" onClick={handleRemoveReplyComment}>
        Delete
      </Button>
    </div>
  );
}

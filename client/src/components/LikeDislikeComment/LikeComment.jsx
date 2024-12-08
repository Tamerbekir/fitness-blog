import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LIKE_COMMENT } from "../../../utils/mutations";
import { DISLIKE_COMMENT } from "../../../utils/mutations";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QUERY_ME, QUERY_POSTS } from "../../../utils/queries";


import "./assets/likeDislikeComment.css";

export default function LikeComment({
  commentId,
  replyId,
  refetch,
}) {
  const {
    data: dataMe,
    loading: loadingMe,
    error: errorMe,
  } = useQuery(QUERY_ME);

  const [likeComment] = useMutation(LIKE_COMMENT, {
    onCompleted: () => refetch(),
  });


  const handleLikeComment = async () => {
    try {
      await likeComment({
        variables: {
          commentId,
          replyId,
        },
      });
      console.log("Liked comment!", commentId);
    } catch (error) {
      console.error("there was an error liking comment", error);
    }
  };



  if (loadingMe) return <p>Loading comments...please wait</p>;
  if (errorMe) return <p>Error: {errorMe.message}</p>;
  if (!dataMe) return <p>No comments found!</p>;

  return (
    <div>
      <FontAwesomeIcon
        className="likeIcon"
        icon={faThumbsUp}
        style={{ cursor: "pointer" }}
        onClick={handleLikeComment}
      />
    </div>
  );
}

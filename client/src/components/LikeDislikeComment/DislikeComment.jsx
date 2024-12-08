import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LIKE_COMMENT } from "../../../utils/mutations";
import { DISLIKE_COMMENT } from "../../../utils/mutations";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
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

  const [userDislike, setUserDislike] = useState('')

  const [dislikeComment] = useMutation(DISLIKE_COMMENT, {
    onCompleted: () => refetch(),
  });
  

  const handleDislikeComment = async () => {
    try {
      await dislikeComment({
        variables: {
          commentId,
          replyId,
        },
      });
      console.log("Disliked Comment!", commentId);
    } catch (error) {
      console.error("there was an error disliking comment", error);
    }
  };

  useEffect(() => {
    if (dataMe) {
        const userDislikesComment = dataMe.me.posts.map((userComments) => userComments.comments.map((userLikes) => userLikes.likes))

        if(userDislikesComment.includes(commentId)) {
            setUserDislike('Disliked!')
        }
    }
  }, [dataMe])


  if (loadingMe) return <p>Loading comments...please wait</p>;
  if (errorMe) return <p>Error: {errorMe.message}</p>;
  if (!dataMe) return <p>No comments found!</p>;


  return (
    <div>
      <FontAwesomeIcon
        className="dislikeIcon"
        icon={faThumbsDown}
        style={{ cursor: "pointer" }}
        onClick={handleDislikeComment}
      />
      {userDislike}
    </div>
  )
}

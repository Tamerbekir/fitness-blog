// import { useState } from "react";
// import { useMutation, useQuery } from "@apollo/client";
// import { QUERY_ME } from "../../../utils/queries"
// import { REMOVE_REPLY_TO_COMMENT } from '../../../utils/mutations'
// import Button from 'react-bootstrap/Button'

// export default function DeleteReplyComment({ commentId }) {

//   // const {
//   //   loading: loadingMe,
//   //   data: dataMe,
//   //   error: errorMe
//   // } = useQuery(QUERY_ME)

//   // if (loadingMe) return 'Loading, please wait'
//   // if (!dataMe) return 'no user data found'
//   // if (errorMe) return `{error.message}`

//   const [removeReplyComment] = useMutation(REMOVE_REPLY_TO_COMMENT, ({
//     onComplete: () => refetch(),
//     // onError: (error) => console.error('there was an error with the delete reply mutation')
//   }))

//   const handleRemoveReplyComment = async () => {
//     try {
//       await removeReplyComment({
//         variables: {
//           _id: replyId,
//           // commentId: reply._id
//         }
//       })
//       console.log(replyId)
//       console.log('replied deleted')
//     } catch (error) {
//       console.error('There was an error removing reply')
//     }
//   }


//   return (
//     <div>
//       <Button
//         onClick={handleRemoveReplyComment}
//       >
//         Delete Comment
//       </Button>
//     </div>
//   )
// }
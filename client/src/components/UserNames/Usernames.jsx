// import { useQuery } from "@apollo/client"
// import { QUERY_POSTS } from "../../../utils/queries"

// export default function Usernames({postComments}) {

//     const { data: dataPost, loading: loadingPost, error: errorPost } = useQuery(QUERY_POSTS)

    
//     if (loadingPost) return <p>Loading..</p>
//     if (!dataPost) return <p>Loading..</p>
//     if (errorPost) return <p>{error.message}</p>
    
//     return (
//         <div>
//             {dataPost.posts.map(usersInPost => {
//                 <div key={usersInPost._id}>
//                     <p>{usersInPost.profile}</p>
//             </div>
//         })}
//         </div>
//     )
// }
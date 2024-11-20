import { useQuery } from "@apollo/client"
import { QUERY_POSTS, QUERY_ME } from "../../../utils/queries"
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from "@apollo/client";
import { ADD_OR_REMOVE_FAVORITE_POST } from "../../../utils/mutations";
import { useEffect, useState } from "react";
import Auth from "../../../utils/auth";




export default function FavoritePost({ postId, refetch }) {

  const loggedIn = Auth.loggedIn()

  const {
    data: dataMe,
    loading: loadingMe,
    error: errorMe } = useQuery(QUERY_ME)

  const {
    data: dataPost,
    loading: loadingPost,
    error: errorPost
  } = useQuery(QUERY_POSTS)

  const [addedFavorite, setAddedFavorite] = useState('')

  const [favoritePost] = useMutation(ADD_OR_REMOVE_FAVORITE_POST, {
    onCompleted: () => refetch(),
  })


  useEffect(() => {
    if (dataMe && dataPost && loggedIn) {
      const userPostFavId = dataMe.me.favoritePost.map((userFav) => userFav._id)

      // console.log('user fav post id ->', userFavs)

      if (userPostFavId.includes(postId)) {
        // console.log('user fave post', userFavs)
        setAddedFavorite(' Added to favorites!')
      } else {
        setAddedFavorite('');
      }
    }
  }, [dataMe, dataPost, postId]);


  const handleFavoritePost = async () => {
    try {
      await favoritePost({
        variables: {
          postId
        }
      })
      // console.log('added post =>', postId)
      setAddedFavorite(!addedFavorite)
      setUserFavorite(' Added to favorites!')
    } catch (error) {
      console.error(); ('error adding favorite post')
    }
  }

  if (!dataMe || !dataPost) return <p>Loading..</p>
  if (loadingMe || loadingPost) return <p>Loading..please wait</p>
  if (errorMe || errorPost) return <p>{errorPost}</p>

  return (
    <div>
      {dataPost.posts.map((post) => (
        post._id === postId && (
          <Button
            key={post._id}
            onClick={handleFavoritePost}
            className="faveBtn"
          >
            <FontAwesomeIcon icon={faBookmark} />
            {addedFavorite}
          </Button>
        )
      ))}
    </div>
  )
}


import { useMutation } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { QUERY_ME } from "../../../utils/queries"
import { ADD_OR_REMOVE_REACTION_POST } from "../../../utils/mutations"
import { IconButton } from "@mui/material"

const AddReaction = ({ postId }) => {

  const {
    loading,
    error,
    data
  } = useQuery(QUERY_ME)

  const [AddOrRemoveReactionPost] = useMutation(ADD_OR_REMOVE_REACTION_POST)

  const handleAddReaction = async () => {
    try {
      await AddOrRemoveReactionPost({
        variables: {
          _id: postId,
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <p>loading reactions</p>
  if (error) return <p>{error}</p>
  if (!data) return <p>No reactions found</p>

  return (
    <div>
      <p>Reactions coming soon!</p>
      <IconButton onClick={handleAddReaction}>🤨</IconButton>
      <IconButton onClick={handleAddReaction}>😀</IconButton>
      <IconButton onClick={handleAddReaction}>🤨</IconButton>
      <IconButton onClick={handleAddReaction}>😂</IconButton>
      <IconButton onClick={handleAddReaction}>😍</IconButton>
      <IconButton onClick={handleAddReaction}>😢</IconButton>
      <IconButton onClick={handleAddReaction}>😡</IconButton>
    </div>
  )
}

export default AddReaction
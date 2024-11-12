import { useParams } from "react-router-dom"

const UserProfile = () => {
  const { id } = useParams()
  return (
    <div>
      <p>user id is {id}</p>
    </div>
  )
}

export default UserProfile
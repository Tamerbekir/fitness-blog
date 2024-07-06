import { useQuery } from "@apollo/client"
import { QUERY_ME } from "../../../utils/queries"


const DateFormat = () => {
  
  const { loading, error, data } = useQuery(QUERY_ME)
  
  if (loading) return <p>Loading your profile.</p>
  if (error) return <div> <p> Whoops! You need to be logged in to do that.</p><button onClick={loginPage}> Login</button></div>
  if (!data || !data.me) return <p>Profile not found</p>
  
  const createdAt = data.me.createdAt
  return (
    <a>{new Date(parseInt(createdAt)).toLocaleString('en-US', 
    { year: 'numeric', month: 'long', day: 'numeric'})}</a>
  
  )
}

export default DateFormat
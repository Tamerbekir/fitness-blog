import { useQuery } from "@apollo/client";
import { QUERY_TOPICS } from "../../utils/queries";

const Topic = () => {
  const { loading, error, data } = useQuery(QUERY_TOPICS)

  if (loading) return <p>loading topic..please wait</p> 
  if (error) return <p>Error:{ error.message }</p> 
  console.log('Data for topics:', data)
  if (!data || !data.topics) return <p>No topics found</p>

  return (
    <div>
      <p>Topic seed test!</p>
      <h4>Topics</h4>
      {data.topics.map(topic => (
        <div key={topic._id}>
          <p>{topic.topicName}</p>
        </div>
      ))}
    </div>
  )
}

export default Topic
import { useState } from "react"
import { useQuery } from "@apollo/client"
import { useMutation } from "@apollo/client"

import { ADD_WORKOUT } from "../../../utils/mutations"
import { QUERY_ME } from "../CreatePost/CreatePost"



const LogWorkout = () => {

  const [workoutInfo, setWorkoutInfo] = useState({
    workouts: '',
    
  })

  return (
    <div>
      <h1>Log your workouts here!</h1>
    </div>
  )
}

export default LogWorkout
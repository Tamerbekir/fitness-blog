import { useState } from "react"
import { useMutation } from "@apollo/client"
import { REMOVE_WORKOUT } from "../../../utils/mutations"
import Button from 'react-bootstrap/Button'

const DeleteWorkout = ({ workoutId, refetch }) => {

  const [removeWorkout] = useMutation(REMOVE_WORKOUT, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('There was an error deleting workout', error),
  });

  const [deleteWorkoutForm, setDeleteWorkoutForm] = useState(false);


  const handleDeleteWorkout = async () => {
    try {
      await removeWorkout({
        variables: {
          id: workoutId
        }
      })
      console.log('workout id', workoutId)
    } catch (error) {
      console.error('There was an error deleting workout.', error)
    }
  }

  return (
    <div>
      <Button
        className="deleteWorkoutBtn"
        onClick={handleDeleteWorkout}
      > Delete
      </Button>
    </div>
  )
};

export default DeleteWorkout
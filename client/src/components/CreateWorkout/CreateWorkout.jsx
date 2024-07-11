import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_EXERCISE } from "../../../utils/queries";
import { ADD_WORKOUT } from "../../../utils/mutations";

const CreateWorkout = () => {

  const { 
    loading: loadingExercise, 
    error: errorExercise, 
    data: dataExercise } = useQuery(QUERY_EXERCISE)

  const [addWorkout] = useMutation(ADD_WORKOUT, {
    onCompleted: () => {
      refetch(); // Refetch the data after the mutation is completed
    }
  });

  const [addWorkoutForm, setAddWorkoutForm] = useState()

  const profileRedirect = () => {
    window.location.href = './profile'
  }

  const [addWorkoutInfo, setAddWorkoutInfo] = useState({
    weight: '',
    reps: '',
    exercise: ''
  });

  const handleAddWorkoutChange = (event) => {
    const { name, value } = event.target;
    setAddWorkoutInfo({
      ...addWorkoutInfo,
      [name]: value
    });
  };

  const handleAddWorkout = async () => {
    try {
      await addWorkout({
        variables: {
          weight: parseFloat(addWorkoutInfo.weight),
          reps: parseInt(addWorkoutInfo.reps),
          exercise: addWorkoutInfo.exercise
        }
      });
      // Resetting the form after successful mutation
      setAddWorkoutInfo({
        weight: '',
        reps: '',
        exercise: ''
      });
      setAddWorkoutForm(true)
    } catch (error) {
      console.log('addWorkoutInfo', addWorkoutInfo);
      console.error('there was an error creating a workout');
    }
  };

  if (loadingExercise) return <p>Loading workout creation...</p>;
  if (errorExercise) return <p>{error.message || errorExercise.message}</p>;
  if (!dataExercise) return <p>Profile or workout data not found</p>;

  // const workouts = data.me.workouts;

  return (
    <div>
      <h1>Log your workouts here!</h1>
      <div>
        <label htmlFor="weight">Weight</label>
        <input
          type='text'
          id='weight'
          name='weight'
          value={addWorkoutInfo.weight}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <div>
        <label htmlFor="reps">Reps</label>
        <input
          type='text'
          name='reps'
          id='reps'
          value={addWorkoutInfo.reps}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <div>
        <label htmlFor="exercise">Exercise</label>
        <select
          name='exercise'
          id='exercise'
          value={addWorkoutInfo.exercise}
          onChange={handleAddWorkoutChange}
        >
          {dataExercise.exercises.map((exercise) => (
            <option key={exercise._id} value={exercise._id}>
              {exercise.exerciseName}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleAddWorkout}>Log workout</button>
      {addWorkoutForm && (
        <button onClick={profileRedirect}>View Workouts</button>
      )}
      <div>


      </div>
    </div>
  );
};

export default CreateWorkout;

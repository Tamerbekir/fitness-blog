import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_WORKOUT } from "../../../utils/mutations";
import { QUERY_ME, QUERY_EXERCISE } from "../../../utils/queries";

const CreateWorkout = () => {
  const { loading, error, data, refetch } = useQuery(QUERY_ME);
  const { loading: loadingExercise, error: errorExercise, data: dataExercise } = useQuery(QUERY_EXERCISE);

  const [addWorkout] = useMutation(ADD_WORKOUT, {
    onCompleted: () => {
      refetch(); // Refetch the data after the mutation is completed
    }
  });

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
      // Reset the form after successful mutation
      setAddWorkoutInfo({
        weight: '',
        reps: '',
        exercise: ''
      });
    } catch (error) {
      console.log('addWorkoutInfo', addWorkoutInfo);
      console.error('there was an error creating a workout');
    }
  };

  if (loading || loadingExercise) return <p>Loading workout creation...</p>;
  if (error || errorExercise) return <p>{error.message || errorExercise.message}</p>;
  if (!data || !dataExercise) return <p>Profile or workout data not found</p>;

  const workouts = data.me.workouts;

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
      <div>
        <h2>Workouts</h2>
        {workouts.map((workout) => (
          <div key={workout._id}>
            <h3>Exercise</h3>
            <p>{workout.exercise.exerciseName}</p>
            <h4>Weight</h4>
            <p>{workout.weight}</p>
            <h4>Reps</h4>
            <p>{workout.reps}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateWorkout;

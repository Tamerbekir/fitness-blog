import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_EXERCISE } from "../../../utils/queries";
import { ADD_WORKOUT } from "../../../utils/mutations";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import Autocomplete from '@mui/material/Autocomplete';
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { Button } from '@mui/material';
import { ToastContainer, toast, Bounce } from 'react-toastify'

import './assets/CreateWorkout.css'
import WorkoutGird from '../../components/WorkoutGird/WorkoutGrid'

const CreateWorkout = () => {
  const {
    loading: loadingExercise,
    error: errorExercise,
    data: dataExercise,
    refetch
  } = useQuery(QUERY_EXERCISE);

  const [addWorkout] = useMutation(ADD_WORKOUT, {
    onCompleted: () => {
      refetch(); // Refetch the data after the mutation is completed
    },
  });

  const [addWorkoutForm, setAddWorkoutForm] = useState();
  // adds 1 and starting at 1
  const [counter, setCounter] = useState(1)

  const profileRedirect = () => {
    window.location.href = "./profile";
  };

  const [addWorkoutInfo, setAddWorkoutInfo] = useState({
    weight: '',
    reps: '',
    sets: counter, // using the counter useState
    miles: '',
    pace: '',
    notes: '',
    exercise: '',
  });

  const handleAddWorkoutChange = (event) => {
    const { name, value } = event.target;
    setAddWorkoutInfo({
      ...addWorkoutInfo,
      [name]: value,
    });
  };

  const handleAddWorkout = async () => {
    try {
      await addWorkout({
        variables: {
          //adding parseFloat for each variable
          weight: parseFloat(addWorkoutInfo.weight),
          reps: parseFloat(addWorkoutInfo.reps),
          sets: counter, // Use counter for sets using useState
          miles: parseFloat(addWorkoutInfo.miles),
          pace: parseFloat(addWorkoutInfo.pace),
          notes: addWorkoutInfo.notes,
          exercise: addWorkoutInfo.exercise,
        }
      })
      //general success message
      toast.success('Workout Added!', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
      // Add 1 to the counter after logging the workout
      //using useState for adding workout, using information fro the addWorkoutInfo, clearing out the fields necessary and keeping the fields for users when wanting to continue a workout with the same exercise
      // using arrow function to ensure react it always using the most up to date state value / counter
      setCounter(countWorkout => countWorkout + 1)
      setAddWorkoutInfo({
        ...addWorkoutInfo,
        sets: counter + 1,
        miles: '',
        pace: '',
        notes: '',
      });
      setAddWorkoutForm(true);
    } catch (error) {
      toast.error('Workout not added. Please check your fields and try again', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
      console.error("there was an error creating a workout", error);
    }
  };

  if (loadingExercise) return <p>Loading workout creation...</p>;
  if (errorExercise) return <p>Error: {errorExercise.message}</p>;
  if (!dataExercise) return <p>Workout data not found</p>;

  return (
    <div>
      <div>
        <Autocomplete
          className="exercise-select"
          options={dataExercise.exercises.map((exercise) => exercise.exerciseName)}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField {...params} 
            variant='filled'
            label="Pick an Activity" 
            margin="normal" />
          )}
          value={addWorkoutInfo.exercise}
          onChange={(event, newValue) => setAddWorkoutInfo({ ...addWorkoutInfo, exercise: newValue })}
          renderOption={(props, option, { inputValue }) => {
            const { key, ...optionProps } = props;
            const matches = AutosuggestHighlightMatch(option, inputValue, { insideWords: true });
            const parts = AutosuggestHighlightParse(option, matches);
            return (
              <li key={key} {...optionProps}>
                <div>
                  {parts.map((part, index) => (
                    <span
                      variant="filled"
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            );
          }}
        />
        <FormControl />
      </div>
      <div>
        <TextField
          className="userSets"
          label='Sets'
          variant="filled"
          type="number"
          id="sets"
          name="sets"
          value={addWorkoutInfo.sets}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <div>
        <TextField
          className="userWeight"
          label='Weight'
          variant="filled"
          type="number"
          id="weight"
          name="weight"
          value={addWorkoutInfo.weight}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <div>
        <TextField
          className="userReps"
          label='Reps'
          variant="filled"
          type="number"
          name="reps"
          id="reps"
          value={addWorkoutInfo.reps}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <div>
        <TextField
          className="userMiles"
          label='Miles'
          variant="filled"
          type="number"
          name="miles"
          id="miles"
          value={addWorkoutInfo.miles}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <div>
        <TextField
          className="userPace"
          label='Pace'
          variant="filled"
          type="number"
          name="pace"
          id="pace"
          value={addWorkoutInfo.pace}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <div>
        <TextField
          className="userNotes"
          label='Notes'
          variant="filled"
          type="text"
          name="notes"
          id="notes"
          value={addWorkoutInfo.notes}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <Button className="logWorkoutBtn" refetch={refetch} onClick={handleAddWorkout}>Log</Button>
      {addWorkoutForm && (
        <Button className="vieworkoutBtn" onClick={profileRedirect}>View Complete Workout</Button>
      )}
      <ToastContainer />
      <WorkoutGird />
    </div>
  );
}

export default CreateWorkout;

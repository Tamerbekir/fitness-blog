import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_EXERCISE } from "../../../utils/queries";
import { ADD_WORKOUT } from "../../../utils/mutations";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { IconButton } from '@mui/material';
import './assets/CreateWorkout.css'

const CreateWorkout = () => {
  const {
    loading: loadingExercise,
    error: errorExercise,
    data: dataExercise,
    refetch
  } = useQuery(QUERY_EXERCISE);

  const {
    loading: loading,
    error: error,
    data: data,
  } = useQuery(QUERY_ME);

  const [addWorkout] = useMutation(ADD_WORKOUT, {
    onCompleted: () => {
      refetch(); // Refetch the data after the mutation is completed
    },
  });

  const [addWorkoutForm, setAddWorkoutForm] = useState();

  const profileRedirect = () => {
    window.location.href = "./profile";
  };

  const [addWorkoutInfo, setAddWorkoutInfo] = useState({
    weight: '',
    reps: '',
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
          weight: parseFloat(addWorkoutInfo.weight),
          reps: parseFloat(addWorkoutInfo.reps),
          miles: parseFloat(addWorkoutInfo.miles),
          pace: parseFloat(addWorkoutInfo.pace),
          notes: addWorkoutInfo.notes,
          exercise: addWorkoutInfo.exercise,
        },
      });
      // resetting the form after mutation for adding a workout
      setAddWorkoutInfo({
        weight: '',
        reps: '',
        miles: '',
        pace: '',
        notes: '',
        exercise: '',
      })
      setAddWorkoutForm(true);
    } catch (error) {
      // console.log(addWorkoutInfo.weight, addWorkoutInfo.reps, addWorkoutInfo.exercise);
      console.log("addWorkoutInfo", addWorkoutInfo);
      console.error("there was an error creating a workout");
    }
  };

  if (loadingExercise || loading) return <p>Loading workout creation...</p>;
  if (errorExercise || error) return <p>{error.message || errorExercise.message}</p>;
  if (!dataExercise || !data) return <p>Profile or workout data not found</p>;

  // const workouts = data.me.workouts;

  return (


    <div>
      <div>
        <Autocomplete
          className="exercise-select"
          //for the autocomplete field- mapping over exercise and getting exercise names
          options={dataExercise.exercises.map((exercise) => exercise.exerciseName)}
          getOptionLabel={(option) => option}
          //boilerplate from template
          renderInput={(params) => (
            <TextField {...params} 
            variant='filled'
            label="Pick an Activity" 
            margin="normal" />
          )}
          //the value field will consist of the addWorkoutInto.exercise data
          value={addWorkoutInfo.exercise}
          //Runs when an option is selected. Gets the new value selected.  Updates the usestate. Keeps all old values, but changes exercise to the new value
          onChange={(event, newValue) => setAddWorkoutInfo({ ...addWorkoutInfo, exercise: newValue })}
           //boiler plate template
          renderOption={(props, option, { inputValue }) => {
            const { key, ...optionProps } = props;
            const matches = match(option, inputValue, { insideWords: true });
            const parts = parse(option, matches);

            //boiler plate template
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
          className="userWeight"
          label='Weight'
          variant="filled"
          type="text"
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
          type="text"
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
          type="text"
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
          type="text"
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
      <IconButton className="logWorkoutBtn" refetch={refetch} onClick={handleAddWorkout}>Log</IconButton>
      {addWorkoutForm && (
        <IconButton className="vieworkoutBtn" onClick={profileRedirect}>View Complete Workout</IconButton>
      )}
    </div>
  )
}

export default CreateWorkout

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
import WorkoutGrid from '../../components/WorkoutGird/WorkoutGrid';
import { useEffect } from "react";
import { QUERY_ME } from "../../../utils/queries";



const CreateWorkout = () => {

  const {
    loading: loadingExercise,
    error: errorExercise,
    data: dataExercise,
    refetch
  } = useQuery(QUERY_EXERCISE);

  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe,
  } = useQuery(QUERY_ME);

  const [addWorkout] = useMutation(ADD_WORKOUT, {
    onCompleted: () => refetch()
  });

  const [addWorkoutForm, setAddWorkoutForm] = useState();
  // adds 1 and starting at 1
  const [counter, setCounter] = useState(1)

  const profileRedirect = () => {
    window.location.href = "./profile";
  };

  const completeSet = () => {
    window.location.href = './log-workout'
    localStorage.removeItem('workoutHistory')
  }

  //creating a useState to grab the information from the workout so we can add it to local storage
  const [newItemAdded, setNewItemAdded] = useState(() => {
    const storedWorkout = localStorage.getItem('workoutHistory')

    if (storedWorkout) {
      return JSON.parse(storedWorkout)
    } else {
      return []
    }
  })

  //useEffect to put the new item we added to local storage
  useEffect(() => {
    localStorage.setItem('workoutHistory', JSON.stringify(newItemAdded))
  }, [newItemAdded])

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

  // const clearField = () => {
  //   setAddWorkoutForm({
  //     weight: '',
  //     reps: '',
  //     sets: '',
  //     miles: '',
  //     pace: '',
  //     notes: '',
  //     exercise: '',
  //   })
  // }

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

      //using a variable to define the newly added item as well as the workout info
      const updatedWorkoutList = [...newItemAdded, addWorkoutInfo]
      //we then send the updated workout list to local storage using the useState
      setNewItemAdded(updatedWorkoutList)

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

  if (loadingExercise || loadingMe) return <p>Loading workout creation...</p>;
  if (errorExercise || errorMe) return <p>Error: {errorExercise.message}</p>;
  if (!dataExercise) return <p>Workout data not found</p>;

  const login = () => {
    window.location.href = './login'
  }
  const signup = () => {
    window.location.href = './signup'
  }

  if (!dataMe.me) {
    return (
      <div className="signinOrSignupDiv">
        <p>Want to log a workout?</p>
        <p>
          Be sure to <Button className='loginBtn' onClick={login}> Login </Button>
          or
          <Button className='signupBtn' onClick={signup}> sign up </Button> here.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="exercise">
        <Autocomplete
          style={{ backgroundColor: "transparent" }}
          className="exercise-select"
          options={dataExercise.exercises.map((exercise) => exercise.exerciseName)}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='filled'
              label="Search an Activity"
              margin="normal"
              InputProps={{
                ...params.InputProps,
                style: {
                  color: 'white',  // Text color
                },
              }}
              InputLabelProps={{
                style: {
                  color: '#00796b',  // Label color
                },
              }}
              sx={{
                '& .MuiFilledInput-underline:before': {
                  borderBottomColor: '#21122d',  // Default border color
                },
                '& .MuiFilledInput-underline:hover:before': {
                  borderBottomColor: '#00796b',  // Hovered border color
                },
                '& .MuiFilledInput-underline:after': {
                  borderBottomColor: '#00796b',  // Focused border color
                },
              }}
            />
          )}
          value={addWorkoutInfo.exercise}
          onChange={(event, newValue) => setAddWorkoutInfo({ ...addWorkoutInfo, exercise: newValue })}
          renderOption={(props, option, { inputValue }) => {
            const { key, ...optionProps } = props;
            const matches = AutosuggestHighlightMatch(option, inputValue, { insideWords: true });
            const parts = AutosuggestHighlightParse(option, matches);
            return (
              <li key={key} {...optionProps}
              >
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
          InputProps={{
            style: {
              color: 'white',  // Text color
            },
          }}
          InputLabelProps={{
            style: {
              color: '#00796b',  // Label color
            },
          }}
          sx={{
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: '#21122d',  // Default border color
            },
            '& .MuiFilledInput-underline:hover:before': {
              borderBottomColor: '#00796b',  // Hovered border color
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomColor: '#00796b',  // Focused border color
            },
          }}
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
          InputProps={{
            style: {
              color: 'white',  // Text color
            },
          }}
          InputLabelProps={{
            style: {
              color: '#00796b',  // Label color
            },
          }}
          sx={{
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: '#21122d',  // Default border color
            },
            '& .MuiFilledInput-underline:hover:before': {
              borderBottomColor: '#00796b',  // Hovered border color
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomColor: '#00796b',  // Focused border color
            },
          }}
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
          InputProps={{
            style: {
              color: 'white',  // Text color
            },
          }}
          InputLabelProps={{
            style: {
              color: '#00796b',  // Label color
            },
          }}
          sx={{
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: '#21122d',  // Default border color
            },
            '& .MuiFilledInput-underline:hover:before': {
              borderBottomColor: '#00796b',  // Hovered border color
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomColor: '#00796b',  // Focused border color
            },
          }}
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
          InputProps={{
            style: {
              color: 'white',  // Text color
            },
          }}
          InputLabelProps={{
            style: {
              color: '#00796b',  // Label color
            },
          }}
          sx={{
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: '#21122d',  // Default border color
            },
            '& .MuiFilledInput-underline:hover:before': {
              borderBottomColor: '#00796b',  // Hovered border color
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomColor: '#00796b',  // Focused border color
            },
          }}
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
          InputProps={{
            style: {
              color: 'white',  // Text color
            },
          }}
          InputLabelProps={{
            style: {
              color: '#00796b',  // Label color
            },
          }}
          sx={{
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: '#21122d',  // Default border color
            },
            '& .MuiFilledInput-underline:hover:before': {
              borderBottomColor: '#00796b',  // Hovered border color
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomColor: '#00796b',  // Focused border color
            },
          }}
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
          InputProps={{
            style: {
              color: 'white',  // Text color
            },
          }}
          InputLabelProps={{
            style: {
              color: '#00796b',  // Label color
            },
          }}
          sx={{
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: '#21122d',  // Default border color
            },
            '& .MuiFill edInput-underline:hover:before': {
              borderBottomColor: '#00796b',  // Hovered border color
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomColor: '#00796b',  // Focused border color
            },
          }}
        />
      </div>
      <Button className="logWorkoutBtn" refetch={refetch} onClick={handleAddWorkout}>Log</Button>
      <Button className="completeSetBtn" onClick={completeSet}>Complete Set</Button>
      {/* <Button onClick={clearField}>Clear</Button> */}
      {addWorkoutForm && (
        <div>
          <Button className="viewWorkoutBtn" onClick={profileRedirect}>View All Workouts</Button>
        </div>
      )}
      <div>
        <div className="workoutTextDiv">
          <h2 className="workoutExerciseText">Current Exercise</h2>
          {addWorkoutInfo.exercise}
          <p className="workoutSetText">Set</p>
          {addWorkoutInfo.sets}
          <p className="workoutWightText">Weight</p>
          {addWorkoutInfo.weight}
          <p className="workoutRepText">Reps</p>
          {addWorkoutInfo.reps}
          <p className="workoutMilesText">Miles</p>
          {addWorkoutInfo.miles}
          <p className="workoutPaceText">Pace</p>
          {addWorkoutInfo.pace}
          <p className="workoutNotesText">Notes</p>
          {addWorkoutInfo.notes}
          <h2 className="workoutExerciseText">Last Sets</h2>
          {newItemAdded.map((workout, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <p><strong>Exercise:</strong> {workout.exercise}</p>
              <p><strong>Sets:</strong> {workout.sets}</p>
              <p><strong>Weight:</strong> {workout.weight}</p>
              <p><strong>Reps:</strong> {workout.reps}</p>
              <p><strong>Miles:</strong> {workout.miles}</p>
              <p><strong>Pace:</strong> {workout.pace}</p>
              <p><strong>Notes:</strong> {workout.notes}</p>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
      <WorkoutGrid />
    </div >
  );
}

export default CreateWorkout;

import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_EXERCISE } from "../../../utils/queries";
import { UPDATE_WORKOUT }from '../../../utils/mutations'
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import WorkoutGrid from '../WorkoutGird/WorkoutGrid'

const EditWorkout = ({ workoutId }) => {

  const {
    loading, 
    error, 
    data, 
    refetch
  } = useQuery(QUERY_ME)

  const {
    loading: loadingExercise,
    error: errorExercise,
    data: dataExercise
  } = useQuery(QUERY_EXERCISE)

  const [editWorkout] = useMutation(UPDATE_WORKOUT, {
    onCompleted:() => refetch(),
    onError: (error) => console.error('error editing workout')
  })

  // const [editWorkoutFormBtn, setEditWorkoutFormBtn ] = useState(false)
  
  const [editWorkoutInfo, setEditWorkoutInfo ] = useState({
    exercise: '',
    reps: '',
    weight: '',
    pace: '',
    sets: '',
    miles: '',
    notes: ''
  })

  if (loading || loadingExercise) return <p>Loading your workout...</p>
  if (error || errorExercise) return <div> <p>{error}</p></div>
  if (!data || !dataExercise) return <p>Profile or exercise not found to edit workout</p>


  useEffect(() => {
    if(data) {
      //finding the workout data under query ME and displaying the workout info for the user
      const workoutData = data.me.workouts.find((workout) = workout._id === workoutId)
      //mapping over the exercises in the ME query under workouts to get the exercise name from exercise array
      const workoutExercise = data.me.workouts.map((exercise) => exercise.exerciseName)
      setEditWorkoutInfo({
        id: workoutId,
        exercise: workoutExercise,
        reps: workoutData.reps,
        weight: workoutData.weight,
        pace: workoutData.pace,
        sets: workoutData.sets,
        miles: workoutData.miles,
        notes: workoutData.notes,
      })
    }
  }, [data, workoutId])

  //taking in the new text the user provides in the fields to change the workout info
  const handleWorkoutChange =(event) => {
    const {name, value} = event.target
    setEditWorkoutInfo({
      ...editWorkoutInfo,
      [name]: value
    })
  }


  const handleEditWorkoutChange = async () => {
    try {
      const { data: userEditWorkout } = await editWorkout({
        variables: {
          ...editWorkoutInfo,
          exercise: editWorkoutInfo.exercise,
          reps: editWorkoutInfo.reps,
          weight: editWorkoutInfo.weight,
          pace: editWorkoutInfo.pace,
          sets: editWorkoutInfo.sets,
          miles: editWorkoutInfo.miles,
          notes: editWorkoutInfo.notes,
        }
      })
    } catch (error) {
      console.error('there was an error editing this workout', error)
    }
    console.log( 
      'exercise', editWorkoutInfo.exercise, 
      'reps:',editWorkoutInfo.reps, 
      'weight:', editWorkoutInfo.weight,
      'pace:', editWorkoutInfo.pace,
      'sets:', editWorkoutInfo.sets,
      'miles:', editWorkoutInfo.miles,
      'notes:', editWorkoutInfo.notes, )
  }



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
          value={editWorkoutInfo.exercise}
          //Runs when an option is selected. Gets the new value selected.  Updates the usestate. Keeps all old values, but changes exercise to the new value
          onChange={(event, newValue) => setEditWorkoutInfo({ ...editWorkoutInfo, exercise: newValue })}
           //boiler plate template
          renderOption={(props, option, { inputValue }) => {
            const { key, ...optionProps } = props;
            const matches = AutosuggestHighlightMatch(option, inputValue, { insideWords: true });
            const parts = AutosuggestHighlightParse(option, matches);

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
          className="userSets"
          label='Sets'
          variant="filled"
          type="text"
          id="sets"
          name="sets"
          value={editWorkoutInfo.sets}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <div>
        <TextField
          className="userWeight"
          label='Weight'
          variant="filled"
          type="text"
          id="weight"
          name="weight"
          value={editWorkoutInfo.weight}
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
          value={editWorkoutInfo.reps}
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
          value={editWorkoutInfo.miles}
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
          value={editWorkoutInfo.pace}
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
          value={editWorkoutInfo.notes}
          onChange={handleAddWorkoutChange}
        />
      </div>
      <IconButton className="editWorkoutBtn" refetch={refetch} onClick={handleWorkoutChange}>Edit</IconButton>

      <IconButton onClick={handleEditWorkoutChange}>Submit Edit</IconButton>

      <WorkoutGird />
    </div>
  )
}

export default EditWorkout
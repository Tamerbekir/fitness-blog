import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { IconButton, Button, TextField, FormControl, Autocomplete } from "@mui/material";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { QUERY_ME, QUERY_EXERCISE } from "../../../utils/queries";
import { UPDATE_WORKOUT } from '../../../utils/mutations';
import WorkoutGrid from '../../components/WorkoutGird/WorkoutGrid';

const EditWorkout = () => {
  const { loading, error, data, refetch } = useQuery(QUERY_ME);
  const { loading: loadingExercise, error: errorExercise, data: dataExercise } = useQuery(QUERY_EXERCISE);

  const [editWorkout] = useMutation(UPDATE_WORKOUT, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('error editing workout')
  });

  const [editWorkoutInfo, setEditWorkoutInfo] = useState({
    exercise: '',
    reps: '',
    weight: '',
    pace: '',
    sets: '',
    miles: '',
    notes: ''
  });

  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null); // To track which workout is being edited

  useEffect(() => {
    if (data && selectedWorkoutId) {
      const workoutData = data.me.workouts.find((workout) => workout._id === selectedWorkoutId);
      setEditWorkoutInfo({
        id: selectedWorkoutId,
        exercise: workoutData.exercise,
        reps: workoutData.reps,
        weight: workoutData.weight,
        pace: workoutData.pace,
        sets: workoutData.sets,
        miles: workoutData.miles,
        notes: workoutData.notes,
      });
    }
  }, [data, selectedWorkoutId]);

  const handleWorkoutChange = (event) => {
    const { name, value } = event.target;
    setEditWorkoutInfo({
      ...editWorkoutInfo,
      [name]: value
    });
  };

  const handleEditWorkout = async () => {
    try {
      console.log("Variables sent to mutation:", {
        ...editWorkoutInfo,
        exercise: editWorkoutInfo.exercise,
        reps: editWorkoutInfo.reps,
        weight: editWorkoutInfo.weight,
        pace: editWorkoutInfo.pace,
        sets: editWorkoutInfo.sets,
        miles: editWorkoutInfo.miles,
        notes: editWorkoutInfo.notes,
      });

      await editWorkout({
        variables: {
          ...editWorkoutInfo,
          exercise: editWorkoutInfo.exercise,
          reps: parseFloat(editWorkoutInfo.reps),   // Ensure these are numbers
          weight: parseFloat(editWorkoutInfo.weight),
          pace: parseFloat(editWorkoutInfo.pace),
          sets: parseFloat(editWorkoutInfo.sets),
          miles: parseFloat(editWorkoutInfo.miles),
          notes: editWorkoutInfo.notes,
        }
      });

      console.log('Workout edited successfully');
      setSelectedWorkoutId(null); // Close the edit form after submission
    } catch (error) {
      console.error('Error editing workout:', error.message);
    }
  };


  const handleEditButtonClick = (workoutId) => {
    setSelectedWorkoutId(workoutId);
  };

  if (loading || loadingExercise) return <p>Loading your workout...</p>;
  if (error || errorExercise) return <p>Error: {error?.message || errorExercise?.message}</p>;
  if (!data || !dataExercise) return <p>Profile or exercise not found to edit workout</p>;

  return (
    <div>
      <h2 className="workoutExerciseText">Last Sets</h2>
      {data.me.workouts.map((workout, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <p><strong>Exercise:</strong>
            {/* Check if workout.exercise is an array and map over it */}
            {Array.isArray(workout.exercise) ?
              workout.exercise.map((ex, idx) => <span key={idx}>{ex.exerciseName}</span>) :
              workout.exercise.exerciseName
            }
          </p>
          <p><strong>Sets:</strong> {workout.sets}</p>
          <p><strong>Weight:</strong> {workout.weight}</p>
          <p><strong>Reps:</strong> {workout.reps}</p>
          <p><strong>Miles:</strong> {workout.miles}</p>
          <p><strong>Pace:</strong> {workout.pace}</p>
          <p><strong>Notes:</strong> {workout.notes}</p>
          <Button onClick={() => handleEditButtonClick(workout._id)}>Edit</Button>

          {selectedWorkoutId === workout._id && (
            <div>
              <Autocomplete
                className="exercise-select"
                options={dataExercise.exercises.map((exercise) => exercise.exerciseName)}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} variant='filled' label="Pick an Activity" margin="normal" />
                )}
                value={editWorkoutInfo.exercise}
                onChange={(event, newValue) => setEditWorkoutInfo({ ...editWorkoutInfo, exercise: newValue })}
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
              <div>
                <TextField
                  className="userSets"
                  label='Sets'
                  variant="filled"
                  type="text"
                  id="sets"
                  name="sets"
                  value={editWorkoutInfo.sets}
                  onChange={handleWorkoutChange}
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
                  onChange={handleWorkoutChange}
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
                  onChange={handleWorkoutChange}
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
                  onChange={handleWorkoutChange}
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
                  onChange={handleWorkoutChange}
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
                  onChange={handleWorkoutChange}
                />
              </div>
              <IconButton onClick={handleEditWorkout}>Submit Edit</IconButton>
            </div>
          )}
        </div>
      ))}
      <WorkoutGrid />
    </div>
  );
};

export default EditWorkout;

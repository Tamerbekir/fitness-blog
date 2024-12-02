import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { Accordion, Card, Col, Button, Form, Container } from 'react-bootstrap';
import { QUERY_ME, QUERY_EXERCISE } from "../../../utils/queries.js";
import { UPDATE_WORKOUT } from "../../../utils/mutations.js";
import DeleteWorkout from '../DeleteWorkout/DeleteWorkouts.jsx'
import './assets/currentWorkout.css'
// import Auth from '../../../utils/auth'
import TextField from '@mui/material/TextField';


const WorkoutData = () => {
  // const loggedIn = Auth.loggedIn()

  const { loading, error, data, refetch } = useQuery(QUERY_ME);

  const sx = {
    backgroundColor: 'white',
    borderRadius: '10px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '10px',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(16px, -0px)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#f9c000',
    },
    margin: '1%'
  };
  const { loading: loadingExercise, error: errorExercise, data: dataExercise } = useQuery(QUERY_EXERCISE);


  const [editingWorkoutId, setEditingWorkoutId] = useState(null);

  const [editWorkoutInfo, setEditWorkoutInfo] = useState({
    exercise: "",
    reps: "",
    weight: "",
    pace: "",
    duration: "",
    calories: '',
    sets: "",
    miles: "",
    notes: "",
  });

  const [updateWorkout] = useMutation(UPDATE_WORKOUT, {
    onCompleted: (data) => {
      console.log("Workout updated successfully:", data);
      // This state variable holds the ID of the workout that is currently being edited. When a user clicks on the "Edit" button for a specific workout, editingWorkoutId is set to that workout's ID.
      // By setting it to null, we no longer need to keep track of the workout being edited because the editing process is finished. 
      setEditingWorkoutId(null);
      // refetch the update to reflect live
      refetch();
    },
    onError: (error) => {
      console.error("Error updating workout:", error);
    },
  });

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });


  const workouts = data?.me?.workouts || [];

  // we make groupedWorkouts an empty object so we can push our workouts into it
  const groupedWorkouts = {};

  // using a for loop to iterate over each of the users workout and group them by the date
  // Iterate through each workout
  for (let i = 0; i < workouts.length; i++) {
    const workoutDate = new Date(parseInt(workouts[i].createdAt));
    const currentDate = workoutDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Check if the workout date matches today's date
    if (currentDate === today) {
      if (!groupedWorkouts[currentDate]) {
        groupedWorkouts[currentDate] = {};
      }

      const exercise = workouts[i].exercise
      console.log(exercise)
      if (exercise) {
        for (let j = 0; j < workouts[i].exercise.length; j++) {
          const exerciseName = workouts[i].exercise[j]?.exerciseName;

          if (exerciseName) {
            if (!groupedWorkouts[currentDate][exerciseName]) {
              groupedWorkouts[currentDate][exerciseName] = [];
            }
            groupedWorkouts[currentDate][exerciseName].push(workouts[i]);
          }
        }
      } else {
        console.error(`Workout ID ${workouts[i]._id} has no exercises`);
      }
    }
  }

  // handling the edit click. When the user clicks the edit button, it will take in a parameter we call 'workout' which is an object that contains all of the details about the workout we are about to edit..
  const handleEditClick = (workout) => {
    // then we apply it to our useState setEditingWorkoutId and give it the parameter name 'workout' and give it an _id
    // This tells the application which workout is currently being edited.
    setEditingWorkoutId(workout._id);
    // Then from our useState we pass in the parameter 'workout' as well as exercise. We apply the parameter to our exercise 
    setEditWorkoutInfo({
      // then we take our parameter with the details we have from the workout._id and spread them here
      ...workout,
      // This represents the exercise field in the workout object.
      // we access the first element in the array, which is the exercise the user is editing in the array. Without exercise[0] we will get 'object, object' as a return. This is because JavaScript will look for ALL objects in an array unless we specify it. So, [0] will allow us to access the first and only object in the exercise array for this edited workout
      exercise: workout.exercise[0].exerciseName
    });
  };

  // handling the input changes via form control
  const handleWorkoutChange = (event) => {
    const { name, value } = event.target;
    setEditWorkoutInfo({
      ...editWorkoutInfo,
      [name]: value,
    });
  };
  // Trigger mutation when user leaves the input field



  // the mutation to handle the edited workout and update it
  //! currently using onBlur for saving
  const handleSaveEdit = async () => {
    try {
      await updateWorkout({
        variables: {
          id: editingWorkoutId,
          weight: parseFloat(editWorkoutInfo.weight),
          reps: parseFloat(editWorkoutInfo.reps),
          sets: parseFloat(editWorkoutInfo.sets),
          miles: parseFloat(editWorkoutInfo.miles),
          pace: parseFloat(editWorkoutInfo.pace),
          duration: parseFloat(editWorkoutInfo.duration),
          calories: parseFloat(editWorkoutInfo.calories),
          notes: editWorkoutInfo.notes,
          exercise: editWorkoutInfo.exercise,
        },
      });
      console.log("Workout updated successfully", editWorkoutInfo);
    } catch (error) {
      console.error("Error saving workout edit:", error, editWorkoutInfo);
    }
  };


  if (loading || loadingExercise) return <p>Loading workouts...</p>;
  if (error || errorExercise) return <p>{error.message || errorExercise.message}</p>;
  if (!dataExercise) return <p>No workout data found</p>;

  const isRunning = editWorkoutInfo.exercise.toLowerCase().includes('running')
  const isWalking = editWorkoutInfo.exercise.toLowerCase().includes('walk')
  const isCardioOnly = editWorkoutInfo.exercise.toLowerCase().includes('cardio')
  const dumbbellOnly = editWorkoutInfo.exercise.toLowerCase().includes('dumbbell')



  return (
    <Container className="workout-container">
      {editWorkoutInfo.exercise ? (
        <h4 className="text-center mb-4 title">No Workouts Recorded Today</h4>
      ) : (
        ''
      )}

      {/* Grouping workouts by their date, mapping over each grouped workout */}
      {Object.keys(groupedWorkouts).map((currentActivity) => (
        <Accordion className="item mb-2 main" >
          {Object.keys(groupedWorkouts[currentActivity]).map((exerciseName) => (
            <Accordion.Item eventKey={exerciseName}>
              <Accordion.Header>{exerciseName}</Accordion.Header>
              <Accordion.Body>
                <div className="infoWorkoutDiv">
                  {groupedWorkouts[currentActivity][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('running')
                    || groupedWorkouts[currentActivity][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('walk')
                    || groupedWorkouts[currentActivity][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('cycling') ? (
                    <>
                      {!editingWorkoutId && (
                        <>
                          <p>Set</p>
                          <p>Miles</p>
                          <p>Pace</p>
                          <p>Calories</p></>
                      )}
                    </>
                  ) : groupedWorkouts[currentActivity][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('cardio') ? (
                    <>
                      {!editingWorkoutId &&
                        <>
                          <p>Set</p>
                          <p>Duration</p>
                          <p>Calories</p>
                        </>
                      }
                    </>
                  ) : (
                    <>
                      {!editingWorkoutId &&
                        <>
                          <p>Set</p>
                          <p>{groupedWorkouts[currentActivity][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('dumbbell') || groupedWorkouts[currentActivity][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('hammer') ? 'Weight Per Arm' : 'Weight'}</p>
                          <p>Reps</p>
                        </>
                      }
                    </>
                  )}
                </div>
                {groupedWorkouts[currentActivity][exerciseName].map((workout, index) => (
                  <div className="mb-3" key={index}>
                    {editingWorkoutId === workout._id ? (
                      <Form className="editFormInputs" >
                        {/* Make search activity a component and add here */}
                        {isRunning || isWalking ? (
                          <>
                            <TextField
                              sx={sx}
                              size="small"
                              variant="outlined"
                              label='Set'
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              name="sets"
                              value={editWorkoutInfo.sets}
                              onChange={handleWorkoutChange}
                              onBlur={handleChangeBlur}
                            />
                            <TextField
                              sx={sx}
                              size="small"
                              variant="outlined"
                              label='Miles'
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              name="miles"
                              value={editWorkoutInfo.miles}
                              onChange={handleWorkoutChange} />
                            <TextField
                              sx={sx}
                              size="small"
                              label='Pace'
                              variant="outlined"
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              name="pace"
                              value={editWorkoutInfo.pace}
                              onChange={handleWorkoutChange} />
                            <TextField
                              sx={sx}
                              size="small"
                              variant="outlined"
                              label='Calories'
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              name="calories"
                              value={editWorkoutInfo.calories}
                              onChange={handleWorkoutChange} />
                          </>
                        ) : isCardioOnly ? (
                          <>
                            <TextField
                              sx={sx}
                              size="small"
                              name='sets'
                              label='Set'
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              value={editWorkoutInfo.sets}
                              onChange={handleWorkoutChange}
                            />
                            <TextField
                              sx={sx}
                              size="small"
                              name='duration'
                              label='Dur. (mms)'
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              value={editWorkoutInfo.duration}
                              onChange={handleWorkoutChange}
                            />
                            <TextField
                              sx={sx}
                              size="small"
                              name='calories'
                              label='Calories'
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              value={editWorkoutInfo.calories}
                              onChange={handleWorkoutChange}
                            />
                          </>
                        ) : (
                          <>
                            <TextField
                              sx={sx}
                              size="small"
                              label="Set"
                              variant="outlined"
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              name="sets"
                              value={editWorkoutInfo.sets}
                              onChange={handleWorkoutChange} />
                            <TextField
                              sx={sx}
                              size="small"
                              variant="outlined"
                              label={dumbbellOnly ? 'Wt. Per Arm' : 'Weight'}
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              name="weight"
                              value={editWorkoutInfo.weight}
                              onChange={handleWorkoutChange} />

                            <TextField
                              sx={sx}
                              size="small"
                              variant="outlined"
                              label='Reps'
                              inputProps={{
                                inputMode: "decimal",
                                pattern: "[0-9]*[.]?[0-9]*",
                              }}
                              name="reps"
                              value={editWorkoutInfo.reps}
                              onChange={handleWorkoutChange} />
                            {/* <Form.Group className="mb-3 notesInput">
                                    <Col>
                                      <TextField
                                        sx={sx}
                                        size="large"
                                        label="Notes"
                                        variant="outlined"
                                        type="text"
                                        name="notes"
                                        multiline
                                        value={editWorkoutInfo.notes}
                                        onChange={handleWorkoutChange} />
                                    </Col>
                                  </Form.Group> */}
                          </>
                        )}
                      </Form>
                    ) : (
                      <div className="workoutStats" onClick={() => handleEditClick(workout)}>
                        {workout.exercise[0].exerciseName.toLowerCase().includes('running')
                          || workout.exercise[0].exerciseName.toLowerCase().includes('walk') ? (
                          <>
                            <p>{workout.sets}</p>
                            <p>{workout.miles}</p>
                            <p>{workout.pace}</p>
                            <p>{workout.calories}</p>
                          </>
                        ) : workout.exercise[0].exerciseName.toLowerCase().includes('cardio') ? (
                          <>
                            <p>{workout.sets}</p>
                            <p>{workout.duration}</p>
                            <p>{workout.calories}</p>
                          </>
                        ) : (
                          <>
                            <p>{workout.sets}</p>
                            <p>{workout.weight}</p>
                            <p>{workout.reps}</p>
                          </>
                        )}
                      </div>

                    )}
                    {editingWorkoutId === workout._id && (
                      <div className="BtnDiv">
                        <Button
                          className="saveBtn"
                          onClick={() => handleSaveEdit(workout._id)}
                        >
                          Save
                        </Button>
                        <Button
                          className="cancelSaveBtn"
                          onClick={() => setEditingWorkoutId(null)}
                        >
                          Cancel
                        </Button>
                        <DeleteWorkout
                          className="deleteBtn"
                          refetch={refetch}
                          workoutId={workout._id}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {/* <Accordion>
                      <Accordion.Item eventKey="notesAcc">
                        <Accordion.Header>Notes</Accordion.Header>
                        <Accordion.Body>
                          <Form.Group className="mb-3">
                            <Col>
                              <TextField
                                sx={sx}
                                size="xl"
                                label="Notes"
                                variant="outlined"
                                type="text"
                                name="notes"
                                value={editWorkoutInfo.notes}
                                onChange={handleWorkoutChange}
                              />
                            </Col>
                            <Button
                              className="saveBtn"
                              onClick={() => handleSaveEdit(editingWorkoutId)}
                            >
                              Save
                            </Button>
                          </Form.Group>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion> */}
              </Accordion.Body>
            </Accordion.Item>
          ))
          }
        </Accordion >
      ))
      }
    </Container >
  );
};

export default WorkoutData;

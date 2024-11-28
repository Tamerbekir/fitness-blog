import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { Accordion, Card, Col, Button, Form, Container } from 'react-bootstrap';
import { QUERY_ME, QUERY_EXERCISE } from "../../../utils/queries";
import { UPDATE_WORKOUT } from "../../../utils/mutations";
import DeleteWorkout from '../../components/DeleteWorkout/DeleteWorkouts.jsx'
import './assets/workoutGrid.css'
// import Auth from '../../../utils/auth'
import TextField from '@mui/material/TextField';
import { MdMargin } from "react-icons/md";
import { isArray } from "@apollo/client/utilities";
import { parse } from "postcss";


const WorkoutGrid = () => {
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
      // this console error shows us the error as a string. Will keep for now
      // console.log("error details", JSON.stringify(error))
    },
  });

  const workouts = data?.me?.workouts || [];
  const exercises = dataExercise?.exercises || [];

  // we make groupedWorkouts an empty object so we can push our workouts into it
  const groupedWorkouts = {};

  // using a for loop to iterate over each of the users workout and group them by the date
  for (let i = 0; i < workouts.length; i++) {
    // First, we create a date variable by converting the createdAt timestamp found in data.me to a Date object
    const date = new Date(parseInt(workouts[i].createdAt));
    // we then take the date object and turn it into a string using the properties of our choosing
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // then we say, if there is no grouped workout by said formatted date, push the workout into an empty array
    if (!groupedWorkouts[formattedDate]) {
      // IF there is a grouped workout by said formatted date, we push the iterated workout into the existing array
      groupedWorkouts[formattedDate] = {};
    }

    // Staying within our for loop iterating over the workouts, we then iterate over a second time to gain access to the exercise names

    // iterate over each workout index with an exercise
    for (let j = 0; j < workouts[i].exercise.length; j++) {
      // we create a variable for the exercise name to make handling easy.
      // we say the exercise name will be the workout at said index with exercise as said index, will be the exercise name
      const exerciseName = workouts[i].exercise[j].exerciseName;

      // if there are NO grouped workouts with said formatted date AND said exercise name, then put them into an array
      if (!groupedWorkouts[formattedDate][exerciseName]) {
        groupedWorkouts[formattedDate][exerciseName] = [];
      }

      // IF there is a grouped workout with an existing date AND exercise name, then push the iterated workout into the existing array
      groupedWorkouts[formattedDate][exerciseName].push(workouts[i]);
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

  // the mutation to handle the edited workout and update it
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

  // const dumbbellOnly = editWorkoutInfo.exercise.toLowerCase().includes('dumbbell')


  return (
    <Container className="workout-container">
      <h4 className="text-center mb-4 title">Workout History</h4>
      {/* Grouping workouts by their date, mapping over each grouped workout */}
      {Object.keys(groupedWorkouts).map((date) => (
        <Accordion key={date} className="mb-2 main">
          <Accordion.Item className="item" eventKey={date}>
            <Accordion.Header>{date}</Accordion.Header>
            <Accordion.Body>
              {Object.keys(groupedWorkouts[date]).map((exerciseName) => (
                <Accordion Accordion key={exerciseName} className="mb-2 header" >
                  <Accordion.Item eventKey={exerciseName}>
                    <Accordion.Header>{exerciseName}</Accordion.Header>
                    <Accordion.Body>
                      <div className="infoWorkoutDiv">
                        {groupedWorkouts[date][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('running')
                          || groupedWorkouts[date][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('walk')
                          || groupedWorkouts[date][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('cycling') ? (
                          <>
                            <p>Set</p>
                            <p>Miles</p>
                            <p>Pace</p>
                          </>
                        ) : groupedWorkouts[date][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('cardio') ? (
                          <>
                            <p>Set</p>
                            <p>Reps</p>
                            <p>Duration</p>
                          </>
                        ) : (
                          <>
                            <p>Set</p>
                            <p>{groupedWorkouts[date][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('dumbbell') || groupedWorkouts[date][exerciseName][0].exercise[0].exerciseName.toLowerCase().includes('hammer') ? 'Weight Per Arm' : 'Weight'}</p>
                            <p>Reps</p>
                          </>
                        )}
                      </div>
                      {groupedWorkouts[date][exerciseName].map((workout, index) => (
                        <Card className="mb-3" key={index}>
                          {editingWorkoutId === workout._id ? (
                            <Form className="editFormInputs" >
                              {/* Make search activity a component and add here */}
                              {isRunning || isWalking ? (
                                <>
                                  <Form.Group className="mb-2">
                                    {/* <Col>
                                      <TextField
                                        sx={sx}
                                        size="small"
                                        label="Exercise"
                                        variant="outlined"
                                        type="text"
                                        name="exercise"
                                        value={editWorkoutInfo.exercise}
                                        onChange={handleWorkoutChange} />
                                    </Col> */}
                                    {/* User will be able to edit exercisename once I make universal search for worokout component */}
                                    {/* <p>{editWorkoutInfo.exercise}</p> */}
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Col>
                                      <TextField
                                        sx={sx}
                                        size="small"
                                        variant="outlined"
                                        inputProps={{
                                          inputMode: "decimal",
                                          pattern: "[0-9]*[.]?[0-9]*",
                                        }}
                                        name="reps"
                                        value={editWorkoutInfo.reps}
                                        onChange={handleWorkoutChange}
                                      />
                                    </Col>
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Col>
                                      <TextField
                                        sx={sx}
                                        size="small"
                                        variant="outlined"
                                        inputProps={{
                                          inputMode: "decimal",
                                          pattern: "[0-9]*[.]?[0-9]*",
                                        }}
                                        name="miles"
                                        value={editWorkoutInfo.miles}
                                        onChange={handleWorkoutChange} />
                                    </Col>
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Col>
                                      <TextField
                                        sx={sx}
                                        size="small"
                                        variant="outlined"
                                        inputProps={{
                                          inputMode: "decimal",
                                          pattern: "[0-9]*[.]?[0-9]*",
                                        }}
                                        name="pace"
                                        value={editWorkoutInfo.pace}
                                        onChange={handleWorkoutChange} />
                                    </Col>
                                  </Form.Group>
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
                                        onChange={handleWorkoutChange} />
                                    </Col>
                                  </Form.Group>
                                </>
                              ) : isCardioOnly ? (
                                <>
                                  <Col>
                                    <TextField
                                      sx={sx}
                                      size="small"
                                      name='sets'
                                      inputProps={{
                                        inputMode: "decimal",
                                        pattern: "[0-9]*[.]?[0-9]*",
                                      }}
                                      value={editWorkoutInfo.sets}
                                      onChange={handleWorkoutChange}
                                    />
                                  </Col>
                                  <Col>
                                    <TextField
                                      sx={sx}
                                      size="small"
                                      name='reps'
                                      inputProps={{
                                        inputMode: "decimal",
                                        pattern: "[0-9]*[.]?[0-9]*",
                                      }}
                                      value={editWorkoutInfo.reps}
                                      onChange={handleWorkoutChange}
                                    />
                                  </Col>
                                  <Col>
                                    <TextField
                                      sx={sx}
                                      size="small"
                                      name='duration'
                                      inputProps={{
                                        inputMode: "decimal",
                                        pattern: "[0-9]*[.]?[0-9]*",
                                      }}
                                      value={editWorkoutInfo.duration}
                                      onChange={handleWorkoutChange}
                                    />
                                  </Col>
                                </>
                              ) : (
                                <>
                                  {/* <Col>
                                    <TextField
                                      sx={sx}
                                      size="small"
                                      label="Exercise"
                                      variant="outlined"
                                      type="text"
                                      name="exercise"
                                      value={editWorkoutInfo.exercise}
                                      onChange={handleWorkoutChange} />
                                  </Col> */}
                                  {/* User will be able to edit exercisename once I make universal search for worokout component */}
                                  {/* <p>{editWorkoutInfo.exercise}</p> */}
                                  <Form.Group className="mb-3">
                                    <Col>
                                      <TextField
                                        sx={sx}
                                        size="small"
                                        // label="Set"
                                        variant="outlined"
                                        inputProps={{
                                          inputMode: "decimal",
                                          pattern: "[0-9]*[.]?[0-9]*",
                                        }}
                                        name="sets"
                                        value={editWorkoutInfo.sets}
                                        onChange={handleWorkoutChange} />
                                    </Col>
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Col>
                                      <TextField
                                        sx={sx}
                                        size="small"
                                        variant="outlined"
                                        inputProps={{
                                          inputMode: "decimal",
                                          pattern: "[0-9]*[.]?[0-9]*",
                                        }}
                                        name="weight"
                                        value={editWorkoutInfo.weight}
                                        onChange={handleWorkoutChange} />
                                    </Col>
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Col>
                                      <TextField
                                        sx={sx}
                                        size="small"
                                        variant="outlined"
                                        inputProps={{
                                          inputMode: "decimal",
                                          pattern: "[0-9]*[.]?[0-9]*",
                                        }}
                                        name="reps"
                                        value={editWorkoutInfo.reps}
                                        onChange={handleWorkoutChange} />
                                    </Col>
                                  </Form.Group>
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
                                </>
                              ) : workout.exercise[0].exerciseName.toLowerCase().includes('cardio') ? (
                                <>
                                  <p>{workout.sets}</p>
                                  <p>{workout.reps}</p>
                                  <p>{workout.duration}</p>
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
                        </Card>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Accordion.Body>
          </Accordion.Item >
        </Accordion >
      ))
      }
    </Container >
  );
};

export default WorkoutGrid;

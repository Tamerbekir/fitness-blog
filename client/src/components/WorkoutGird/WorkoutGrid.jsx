import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { Accordion, Card, Button, Form, Container } from 'react-bootstrap';
import { QUERY_ME, QUERY_EXERCISE } from "../../../utils/queries";
import { UPDATE_WORKOUT } from "../../../utils/mutations";
import '../../assets/assetsWorkoutGridTemp/workoutGrid.css'

// import Auth from '../../../utils/auth'

const WorkoutGrid = () => {
  // const loggedIn = Auth.loggedIn()

  const { loading, error, data, refetch } = useQuery(QUERY_ME);
  const { loading: loadingExercise, error: errorExercise, data: dataExercise } = useQuery(QUERY_EXERCISE);


  const [editingWorkoutId, setEditingWorkoutId] = useState(null);

  const [editWorkoutInfo, setEditWorkoutInfo] = useState({
    exercise: "",
    reps: "",
    weight: "",
    pace: "",
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
                <Accordion key={exerciseName} className="mb-2 header">
                  <Accordion.Item eventKey={exerciseName}>
                    <Accordion.Header>{exerciseName}</Accordion.Header>
                    <Accordion.Body>
                      {groupedWorkouts[date][exerciseName].map((workout, index) => (
                        <Card className="mb-3" key={index}>

                          <Card.Body>
                            {editingWorkoutId === workout._id ? (
                              <Form>
                                <Form.Group className="mb-3">
                                  <Form.Label>Exercise</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={editWorkoutInfo.exercise}
                                    onChange={handleWorkoutChange}
                                    name="exercise"
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Sets</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={editWorkoutInfo.sets}
                                    onChange={handleWorkoutChange}
                                    name="sets"
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Weight</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={editWorkoutInfo.weight}
                                    onChange={handleWorkoutChange}
                                    name="weight"
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Reps</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={editWorkoutInfo.reps}
                                    onChange={handleWorkoutChange}
                                    name="reps"
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Miles</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={editWorkoutInfo.miles}
                                    onChange={handleWorkoutChange}
                                    name="miles"
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Pace</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={editWorkoutInfo.pace}
                                    onChange={handleWorkoutChange}
                                    name="pace"
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Notes</Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editWorkoutInfo.notes}
                                    onChange={handleWorkoutChange}
                                    name="notes"
                                  />
                                </Form.Group>
                                <Button variant="success" onClick={handleSaveEdit} className="me-2">Save</Button>
                                <Button variant="secondary" onClick={() => setEditingWorkoutId(null)}>Cancel</Button>
                              </Form>
                            ) : (
                              <div className="workoutStats" onClick={() => handleEditClick(workout)}>
                                <p>Exercise:{workout.exercise.map((exercise) => exercise.exerciseName).join(", ")}</p>
                                <p>Sets: {workout.sets}</p>
                                <p>Weight: {workout.weight}</p>
                                <p>Reps: {workout.reps}</p>
                                <><p>Miles: {workout.miles}</p>
                                  <p>Pace: {workout.pace}</p></>
                                <p>Notes: {workout.notes}</p>
                                {/* <Button variant="primary" onClick={() => handleEditClick(workout)} className="mt-2">
                                  Edit Workout
                                </Button> */}
                              </div>
                            )}
                          </Card.Body>

                        </Card>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))
      }
    </Container >
  );
};

export default WorkoutGrid;

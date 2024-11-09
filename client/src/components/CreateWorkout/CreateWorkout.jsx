import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_EXERCISE, QUERY_ME } from "../../../utils/queries";
import { ADD_WORKOUT } from "../../../utils/mutations";
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WorkoutGrid from '../WorkoutGird/WorkoutGrid';
import './assets/createWorkout.css'

const CreateWorkout = () => {
  const { loading: loadingExercise, error: errorExercise, data: dataExercise } = useQuery(QUERY_EXERCISE);
  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME);

  const [addWorkout] = useMutation(ADD_WORKOUT);

  const [workoutForm, setWorkoutForm] = useState(() => {
    const savedWorkoutForm = localStorage.getItem('workoutForm');
    return savedWorkoutForm ? JSON.parse(savedWorkoutForm) : [{ set: 1, weight: '', reps: '', miles: '', pace: '' }];
  });

  const [addWorkoutInfo, setAddWorkoutInfo] = useState(() => {
    const savedWorkoutInfo = localStorage.getItem('addWorkoutInfo');
    return savedWorkoutInfo ? JSON.parse(savedWorkoutInfo) : { exercise: '', notes: '' };
  });

  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showExerciseList, setShowExerciseList] = useState(false);

  useEffect(() => {
    localStorage.setItem('workoutForm', JSON.stringify(workoutForm));
  }, [workoutForm]);

  useEffect(() => {
    localStorage.setItem('addWorkoutInfo', JSON.stringify(addWorkoutInfo));
  }, [addWorkoutInfo]);

  const handleExerciseChange = (e) => {
    const query = e.target.value;
    setAddWorkoutInfo({ ...addWorkoutInfo, exercise: query });

    if (query.length > 0) {
      const matches = dataExercise?.exercises.filter((exercise) =>
        exercise.exerciseName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExercises(matches);
      setShowExerciseList(true);
    } else {
      setFilteredExercises([]);
      setShowExerciseList(false);
    }
  };

  const handleSelectExercise = (exerciseName) => {
    setAddWorkoutInfo({ ...addWorkoutInfo, exercise: exerciseName });
    setShowExerciseList(false);
  };

  const handleSetChange = (index, field, value) => {
    const updatedForm = [...workoutForm];
    updatedForm[index][field] = value;
    setWorkoutForm(updatedForm);
  };

  const handleAddSet = () => {
    setWorkoutForm([...workoutForm, { set: workoutForm.length + 1, weight: '', reps: '', miles: '', pace: '' }]);
  };

  const handleRemoveSet = () => {
    if (workoutForm.length > 1) {
      setWorkoutForm(workoutForm.slice(0, -1));
    } else {
      toast.warn("You must have at least one set!");
    }
  };

  const handleAddWorkoutToLocalStorage = () => {
    localStorage.setItem('workoutForm', JSON.stringify(workoutForm));
  };

  const handleLogWorkout = async () => {
    if (!addWorkoutInfo.exercise) {
      toast.error('Please fill in all fields before logging the workout.', { position: 'bottom-right' });
      return;
    }

    try {
      for (const set of workoutForm) {
        await addWorkout({
          variables: {
            exercise: addWorkoutInfo.exercise,
            reps: parseFloat(set.reps),
            sets: parseFloat(set.set),
            miles: parseFloat(set.miles),
            pace: parseFloat(set.pace),
            weight: parseFloat(set.weight),
            notes: addWorkoutInfo.notes,
          },
        });
      }

      toast.success('Workout Logged!', {
        position: 'bottom-right',
        autoClose: 2000,
        theme: 'light',
        transition: Bounce,
      });

      localStorage.removeItem('workoutForm');
      localStorage.removeItem('addWorkoutInfo');
      setWorkoutForm([{ set: 1, weight: '', reps: '', miles: '', pace: '' }]);
      setAddWorkoutInfo({ exercise: '', notes: '' });
    } catch (error) {
      toast.error('Error logging workout. Please try again.', { position: 'bottom-right' });
      console.error("Error logging workout", error);
    }
  };

  if (loadingExercise || loadingMe) return <p>Loading...</p>;
  if (errorExercise || errorMe) return <p>Error loading data</p>;

  const login = () => {
    window.location = './login'
  }

  const signUp = () => {
    window.location = './signup'
  }

  if (!dataMe.me) {
    return (
      <Container className="signInOrSignupDiv">
        <p>Want to log a workout?</p>
        <p>
          Be sure to <Button onClick={login}>Login</Button> or <Button onClick={signUp}>Sign up</Button> here.
        </p>
      </Container>
    );
  }

  const isRunningExercise = addWorkoutInfo.exercise.toLowerCase().includes("running");

  const isWalkingExercise = addWorkoutInfo.exercise.toLowerCase().includes("walk");


  return (
    <Container>
      <Form.Group controlId="exerciseSearch">
        <Form.Label>Search an Activity</Form.Label>
        <Form.Control
          type="text"
          value={addWorkoutInfo.exercise}
          onChange={handleExerciseChange}
          placeholder="Type to search for an activity"
        />
        {showExerciseList && (
          <ListGroup>
            {filteredExercises.map((exercise) => (
              <ListGroup.Item
                key={exercise._id}
                action
                onClick={() => handleSelectExercise(exercise.exerciseName)}
              >
                {exercise.exerciseName}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form.Group>

      {workoutForm.map((set, index) => (
        <Row key={index} className="mb-3">
          {isRunningExercise || isWalkingExercise ? (
            <>
              <Col>
                <Form.Group controlId={`setSet${index}`}>
                  <Form.Label>Set</Form.Label>
                  <Form.Control
                    type="number"
                    value={set.set}
                    onChange={(e) => handleSetChange(index, 'set', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId={`setReps${index}`}>
                  <Form.Label>Rep</Form.Label>
                  <Form.Control
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId={`setMiles${index}`}>
                  <Form.Label>Miles</Form.Label>
                  <Form.Control
                    type="number"
                    value={set.miles}
                    onChange={(e) => handleSetChange(index, 'miles', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId={`setPace${index}`}>
                  <Form.Label>Pace</Form.Label>
                  <Form.Control
                    type="number"
                    value={set.pace}
                    onChange={(e) => handleSetChange(index, 'pace', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </>
          ) : (
            <>
              <Col>
                <Form.Group controlId={`setSet${index}`}>
                  <Form.Label>Set</Form.Label>
                  <Form.Control
                    type="number"
                    value={set.set}
                    onChange={(e) => handleSetChange(index, 'set', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId={`setWeight${index}`}>
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="number"
                    value={set.weight}
                    onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId={`setReps${index}`}>
                  <Form.Label>Reps</Form.Label>
                  <Form.Control
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </>
          )}
        </Row>
      ))}

      <div className="btnDiv">
        <Button onClick={() => { handleAddSet(), handleAddWorkoutToLocalStorage() }} className="me-2 addSetBtn">Add Set</Button>
        <Button className="removeSetBtn" onClick={handleRemoveSet}>Remove Set</Button>
        <Button className="logWorkoutBtn" onClick={handleLogWorkout}>Log Workout</Button>

      </div>
      {/* 
      <Button onClick={handleAddWorkoutToLocalStorage} className="me-2 saveSetBtn ">Save Progress</Button> */}



      <ToastContainer />
      <WorkoutGrid />
    </Container>
  );
};

export default CreateWorkout;

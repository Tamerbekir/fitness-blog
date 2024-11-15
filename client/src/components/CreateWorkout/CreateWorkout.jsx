import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_EXERCISE, QUERY_ME } from "../../../utils/queries";
import { ADD_WORKOUT } from "../../../utils/mutations";
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Auth from '../../../utils/auth';
import WorkoutGrid from '../WorkoutGird/WorkoutGrid';
import AccessPrompt from "../AccessPrompt/AccessPrompt";
import WorkoutImages from "./WorkoutImages";

const CreateWorkout = ({ refetch }) => {

  const loggedIn = Auth.loggedIn();

  const {
    loading: loadingExercise,
    error: errorExercise,
    data: dataExercise } = useQuery(QUERY_EXERCISE);

  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe } = useQuery(QUERY_ME);

  const [addWorkout] = useMutation(ADD_WORKOUT);

  const [workoutForm, setWorkoutForm] = useState(() => {
    const savedWorkoutForm = localStorage.getItem('workoutForm');
    return JSON.parse(savedWorkoutForm)
  });

  const [addWorkoutInfo, setAddWorkoutInfo] = useState(() => {
    const savedWorkoutInfo = localStorage.getItem('addWorkoutInfo');
    return JSON.parse(savedWorkoutInfo)
  });

  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [countWeight, setCountWeight] = useState(0)

  useEffect(() => {
    localStorage.setItem('workoutForm', JSON.stringify(workoutForm));
  }, [workoutForm]);

  useEffect(() => {
    localStorage.setItem('addWorkoutInfo', JSON.stringify(addWorkoutInfo));
  }, [addWorkoutInfo]);

  const calculateTotalWeight = () => {
    let totalWeight = 0;

    workoutForm.forEach((set) => {
      const weight = set.weight
      const reps = set.reps

      totalWeight += weight * reps
    });

    setCountWeight(totalWeight)
  };

  useEffect(() => {
    calculateTotalWeight();
  }, [workoutForm]);

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
    const lastSet = workoutForm[workoutForm.length - 1]

    setWorkoutForm(
      [...workoutForm,
      { set: workoutForm.length + 1, weight: `${lastSet.weight}`, reps: `${lastSet.reps}`, miles: '', pace: '' }]);
  };

  const handleRemoveSet = () => {
    if (workoutForm.length > 1) {
      const workoutFormData = [...workoutForm]
      workoutFormData.pop()
      setWorkoutForm(workoutFormData)
    } else {
      toast.warn("You must have at least one set");
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

  if (!loggedIn) {
    return (
      <div>
        <Form.Label>Member Access Only</Form.Label>
        <AccessPrompt />
      </div>
    );
  }

  const isRunningExercise = addWorkoutInfo.exercise.toLowerCase().includes("running");
  const isWalkingExercise = addWorkoutInfo.exercise.toLowerCase().includes("walk");

  // const comingSoonImage = 'https://pitchpodcasts.com/img/image-coming-soon.jpg'

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
            {filteredExercises.map((exercise) => {
              const workoutImages = WorkoutImages[exercise.exerciseName.toLowerCase()]
              return (
                <ListGroup.Item
                  key={exercise._id}
                  action
                  onClick={() => handleSelectExercise(exercise.exerciseName)}
                >
                  {workoutImages ? <img style={{ width: '320px' }} src={workoutImages} />
                    :
                    <img style={{ width: '100px' }} src="https://pitchpodcasts.com/img/image-coming-soon.jpg" alt="" />
                  }
                  <p>{exercise.exerciseName}</p>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Form.Group>

      {workoutForm.map((set, index) => (
        <Row key={index} className="mb-3" style={{ padding: '10px' }}>
          {isRunningExercise || isWalkingExercise ? (
            <>
              <Col>
                <Form.Group>
                  <Form.Control
                    placeholder="Set"
                    type="number"
                    value={set.set}
                    onChange={(event) => handleSetChange(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group >
                  <Form.Control
                    placeholder="Reps"
                    type="number"
                    value={set.reps}
                    onChange={(event) => handleSetChange(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group key={index}>
                  <Form.Control
                    placeholder="Miles"
                    type="number"
                    value={set.miles}
                    onChange={(event) => handleSetChange(index, 'miles', event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group key={index}>
                  <Form.Control
                    placeholder="Pace"
                    type="number"
                    value={set.pace}
                    onChange={(event) => handleSetChange(index, 'pace', event.target.value)}
                  />
                </Form.Group>
              </Col>
            </>
          ) : (
            <>
              <Col>
                <Form.Group key={index}>
                  <Form.Control
                    placeholder="Set"
                    type="number"
                    value={set.set}
                    onChange={(event) => handleSetChange(index, 'set', event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group key={index}>
                  <Form.Control
                    placeholder="Weight"
                    type="number"
                    value={set.weight}
                    onChange={(event) => handleSetChange(index, 'weight', event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group key={index}>
                  <Form.Control
                    placeholder="Reps"
                    type="number"
                    value={set.reps}
                    onChange={(event) => handleSetChange(index, 'reps', event.target.value)}
                  />
                </Form.Group>
              </Col>
            </>
          )}
        </Row>
      ))
      }

      <div className="totalWeight">
        <p style={{ color: 'white', fontSize: '20px' }}>Total Weight {countWeight}</p>
      </div>

      <div className="btnDiv">
        <Button
          onClick={() => {
            handleAddSet();
            handleAddWorkoutToLocalStorage();
          }}
          className="me-2 addSetBtn">Add Set</Button>

        <Button
          className="removeSetBtn"
          onClick={handleRemoveSet}
        >
          Remove Set
        </Button>
        <Button
          className="logWorkoutBtn"
          onClick={handleLogWorkout}
          refetch={refetch}
        >
          Log Workout
        </Button>
      </div>
      <WorkoutGrid />
    </Container >
  );
};

export default CreateWorkout;

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_EXERCISE, QUERY_ME } from "../../../utils/queries";
import { ADD_WORKOUT } from "../../../utils/mutations";
import { Form, Button, Container, Row, Col, ListGroup, Accordion, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Auth from '../../../utils/auth';
import WorkoutGrid from '../WorkoutGird/WorkoutGrid';
import AccessPrompt from "../AccessPrompt/AccessPrompt";
import WorkoutImages from "./WorkoutImages";
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { MdClear } from "react-icons/md";
// import { Calculator } from '../../pages/index'
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faCalculator, faCheck, faDumbbell } from '@fortawesome/free-solid-svg-icons';

import './assets/createWorkout.css'

const CreateWorkout = ({ refetch }) => {
  const loggedIn = Auth.loggedIn();

  const navigate = useNavigate()

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
  };

  const { loading: loadingExercise, error: errorExercise, data: dataExercise } = useQuery(QUERY_EXERCISE);
  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME);

  const [addWorkout] = useMutation(ADD_WORKOUT);


  const [workoutData, setWorkoutData] = useState(() => {
    const savedWorkoutData = localStorage.getItem('workoutData');
    if (savedWorkoutData) {
      return JSON.parse(savedWorkoutData)
    } else {
      return {
        exercise: '', notes: '', sets: [{ set: 1, weight: '', reps: '', miles: '', pace: '', duration: '' }]
      }
    }
  })

  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [countWeight, setCountWeight] = useState(0);




  const handleSearchBtn = (exerciseName) => {
    setWorkoutData({ ...workoutData, exercise: exerciseName });
    handleExerciseChange({ target: { value: exerciseName } });
  };


  useEffect(() => {
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
  }, [workoutData]);

  const calculateTotalWeight = () => {
    let totalWeight = 0;

    workoutData.sets.forEach((set) => {
      const weight = parseFloat(set.weight) || 0;
      const reps = parseFloat(set.reps) || 0;
      const dumbbellOnly = workoutData.exercise.toLowerCase().includes('dumbbell')
      const hammerOnly = workoutData.exercise.toLowerCase().includes('hammer')

      if (dumbbellOnly || hammerOnly) {
        totalWeight += (weight * 2) * reps
      } else {
        totalWeight += weight * reps
      }
    });

    setCountWeight(totalWeight);
  };

  useEffect(() => {
    calculateTotalWeight();
  }, [workoutData.sets]);

  const handleExerciseChange = (event) => {
    const selectedActivity = event.target.value;
    setWorkoutData({ ...workoutData, exercise: selectedActivity });

    if (selectedActivity.length > 0) {
      const activityMatch = dataExercise?.exercises.filter((exercise) =>
        exercise.exerciseName.toLowerCase().includes(selectedActivity.toLowerCase())
      );
      setFilteredExercises(activityMatch);
      setShowExerciseList(true);
    } else {
      setFilteredExercises([]);
      setShowExerciseList(false);
    }
  };

  const handleSelectExercise = (exerciseName) => {
    setWorkoutData({ ...workoutData, exercise: exerciseName });
    setShowExerciseList(false);
  };

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...workoutData.sets];
    updatedSets[index][field] = value;
    setWorkoutData({ ...workoutData, sets: updatedSets });
  };

  const handleAddSet = () => {
    const lastSet = workoutData.sets[workoutData.sets.length - 1];
    setWorkoutData({
      ...workoutData,
      sets: [
        ...workoutData.sets,
        {
          set: workoutData.sets.length + 1,
          weight: lastSet.weight,
          reps: lastSet.reps,
          miles: '',
          pace: ''
        }
      ]
    });
  };


  const handleRemoveSet = () => {
    if (workoutData.sets.length > 1) {
      const updatedSets = [...workoutData.sets];
      updatedSets.pop();
      setWorkoutData({ ...workoutData, sets: updatedSets });
    } else {
      toast.warn("You must have at least one set");
    }
  };

  const handleLogWorkout = async () => {
    if (!workoutData.exercise) {
      toast.error('Please fill in all fields before logging the workout.', { position: 'bottom-right' });
      return;
    }



    try {
      for (const set of workoutData.sets) {
        await addWorkout({
          variables: {
            exercise: workoutData.exercise,
            reps: parseFloat(set.reps),
            sets: parseFloat(set.set),
            miles: parseFloat(set.miles),
            pace: parseFloat(set.pace),
            weight: parseFloat(set.weight),
            duration: parseFloat(set.duration),
            notes: workoutData.notes,
          },
        });
      }
      toast.success('Workout Logged!', {
        position: 'bottom-right',
      });

      localStorage.removeItem('workoutData');
      setWorkoutData({ exercise: '', notes: '', sets: [{ set: 1, weight: '', reps: '', miles: '', pace: '', duration: '' }] });
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

  const isRunningExercise = workoutData.exercise.toLowerCase().includes("running");
  const isWalkingExercise = workoutData.exercise.toLowerCase().includes("walk");
  const dumbbellOnly = workoutData.exercise.toLowerCase().includes('dumbbell')
  const hammerOnly = workoutData.exercise.toLowerCase().includes('hammer')
  const cardioOnly = workoutData.exercise.toLowerCase().includes('cardio')


  const workoutBtn = [
    'Abs', 'Biceps', 'Chest', 'Cardio',
    'Walk', 'Triceps', 'Quads',
    'Hamstrings', 'Running',
    'Shoulders', 'Back',
    'Adductor',
    'Abductor'
  ]

  const clearActivity = () => {
    setWorkoutData({
      ...workoutData,
      exercise: ''
    })
    setShowExerciseList(false)
  }

  // const workoutMap = workoutBtn.map((workout) => workout)
  // console.log(workoutMap)


  return (
    <Container>
      <div>
        <Form.Group className="selectActivityInput" controlId="exerciseSearch">
          <Form.Label>Search an Activity</Form.Label>
          <Form.Control
            type="text"
            value={workoutData.exercise}
            onChange={handleExerciseChange}
            placeholder="Type to search for an activity"
          />
          <MdClear className="clearIcon" onClick={clearActivity} />
          <div>
            <Dropdown className='selectActivity'>
              <Dropdown.Toggle className="selectActivityDropdown" variant="light" id="dropdown-basic">
                ..or select an activity
              </Dropdown.Toggle>
              <Dropdown.Menu >
                {workoutBtn.map((workout, index) => (
                  <Dropdown.Item key={index} onClick={() => handleSearchBtn(workout)}>{workout}</Dropdown.Item>
                ))}
              </Dropdown.Menu>

            </Dropdown>
          </div>
          {showExerciseList && (
            <ListGroup>
              {filteredExercises.map((exercise) => {
                const workoutImages = WorkoutImages[exercise.exerciseName.toLowerCase()];
                return (
                  <ListGroup.Item
                    key={exercise._id}
                    action
                    onClick={() => handleSelectExercise(exercise.exerciseName)}
                  >
                    {workoutImages ? (
                      <img style={{ width: '320px' }} src={workoutImages} alt={exercise.exerciseName} />
                    ) : (
                      <img style={{ width: '100px' }} src="https://pitchpodcasts.com/img/image-coming-soon.jpg" alt="Coming soon" />
                    )}
                    <p>{exercise.exerciseName}</p>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Form.Group>
      </div>

      {workoutData.sets.map((set, index) => (
        <Row key={index} className="mb-3" style={{ padding: '10px' }}>
          {cardioOnly ? (
            // Cardio Only: Show Reps and Duration
            <>
              {/* <Col>
          <Form.Group>
            <Form.Control
              placeholder="Set"
              type="number"
              value={set.set}
              onChange={(event) => handleSetChange(index, 'set', event.target.value)}
            />
          </Form.Group>
        </Col> */}
              <Col>
                <TextField
                  sx={sx}
                  size="small"
                  id="outlined-basic"
                  label="Reps"
                  variant="outlined"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                  value={set.reps}
                  onChange={(event) => handleSetChange(index, "reps", event.target.value)}
                />
              </Col>
              <Col>
                <TextField
                  sx={sx}
                  size="small"
                  id="outlined-basic"
                  label="Duration (mins)"
                  variant="outlined"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                  value={set.duration}
                  onChange={(event) => handleSetChange(index, "duration", event.target.value)}
                />
              </Col>
            </>
          ) : isRunningExercise || isWalkingExercise ? (
            // Running or Walking: Show Reps, Miles, and Pace
            <>
              {/* <Col>
          <Form.Group>
            <Form.Control
              placeholder="Set"
              type="number"
              value={set.set}
              onChange={(event) => handleSetChange(index, 'set', event.target.value)}
            />
          </Form.Group>
        </Col> */}
              <Col>
                <TextField
                  sx={sx}
                  size="small"
                  id="outlined-basic"
                  label="Reps"
                  variant="outlined"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                  value={set.reps}
                  onChange={(event) => handleSetChange(index, "reps", event.target.value)}
                />
              </Col>
              <Col>
                <TextField
                  sx={sx}
                  size="small"
                  id="outlined-basic"
                  label="Miles"
                  variant="outlined"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                  value={set.miles}
                  onChange={(event) => handleSetChange(index, "miles", event.target.value)}
                />
              </Col>
              <Col>
                <TextField
                  sx={sx}
                  size="small"
                  id="outlined-basic"
                  label="Pace"
                  variant="outlined"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                  value={set.pace}
                  onChange={(event) => handleSetChange(index, "pace", event.target.value)}
                />
              </Col>
            </>
          ) : (
            // Everything Else: Show Weight and Reps
            <>
              {/* <Col>
          <Form.Group>
            <Form.Control
              placeholder="Set"
              type="number"
              value={set.set}
              onChange={(event) => handleSetChange(index, 'set', event.target.value)}
            />
          </Form.Group>
        </Col> */}
              <Col style={{ display: 'flex' }}>
                <Button className="maxWeightText "
                  onClick={() => navigate('/maxrepcalculator')}
                >
                  <FontAwesomeIcon icon={faDumbbell} size="m" />
                </Button>
                <Button
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  onClick={() => navigate('/platecalculator')}
                >
                  <FontAwesomeIcon icon={faCalculator} size="m" style={{ color: "#f9c000", }} />
                </Button>
                <TextField
                  sx={sx}
                  size="small"
                  id="outlined-basic"
                  label={dumbbellOnly || hammerOnly ? 'Weight Per Arm' : 'Weight'}
                  variant="outlined"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                  value={set.weight}
                  onChange={(event) => handleSetChange(index, "weight", event.target.value)}
                />
              </Col>
              <Col>
                <TextField
                  sx={sx}
                  size="small"
                  id="outlined-basic"
                  label="Reps"
                  variant="outlined"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                  value={set.reps}
                  onChange={(event) => handleSetChange(index, "reps", event.target.value)}
                />
              </Col>
            </>
          )}
        </Row>
      ))}
      <div className="btnDivCreateWorkout">

        <Button
          onClick={() => {
            handleAddSet();
          }}
          className="me-2 addSetBtn"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <Button
          className="removeSetBtn"
          onClick={handleRemoveSet}
        >
          <FontAwesomeIcon icon={faMinus} />
        </Button>

        <Button
          className="logWorkoutBtn"
          onClick={() => {
            handleLogWorkout(),
              navigate('/log-workout')
          }}
        >
          <FontAwesomeIcon icon={faCheck} />
        </Button>
      </div>
      {/* <PlateCalculator /> */}
      <div className="totalWeightDiv">
        <p className="totalWeightText"
          style={{ color: 'white', fontSize: '15px' }}
        >
          Total Weight {countWeight} lb
        </p>
      </div>
      <WorkoutGrid
        refetch={refetch} />
    </Container >
  );
};

export default CreateWorkout;

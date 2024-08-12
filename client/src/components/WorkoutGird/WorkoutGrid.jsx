import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './workoutGrid.css'

const WorkoutGrid = () => {
  const { loading, error, data } = useQuery(QUERY_ME);

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data) return <p>No workout data found</p>;

  //created a variable to help deal with the query ME data handling
  const workouts = data.me.workouts

  //we make groupedWorkouts an empty object so we can push our workouts into it
  const groupedWorkouts = {}

  //using a for loop to iterate over each of the users workout and group them by the date
  for (let i = 0; i < workouts.length; i++) {

    // First, we create a date variable by converting the createdAt timestamp fround in data.me to a Date object
    const date = new Date(parseInt(workouts[i].createdAt))

    //we then take date object and turn it into a string using the properties of our choosing
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    //then we say, if there is no grouped workout by said formatted date, push the workout into a empty array
    if (!groupedWorkouts[formattedDate]) {
      groupedWorkouts[formattedDate] = []
    }

    // IF there is a grouped workout by said formatted date, we push the iterated workout into the existing array
    groupedWorkouts[formattedDate].push(workouts[i])
  }

  //! Without a for loop, getting exerciseNames using map
  // const groupExercisesByName = workouts.map(workout => {
  //   return workout.exercise.map(index => index.exerciseName)
  // })

  const groupExercisesByName = (workouts) => {
    //creating empty object to put exercise names in as a group
    const groupedExercises = {}

    // Loop through each workout
    for (let i = 0; i < workouts.length; i++) {
      const workout = workouts[i];

      // Loop through each exercise in the current workout
      for (let j = 0; j < workout.exercise.length; j++) {
        const workoutExercise = workout.exercise[j];

        // If the exercise name doesn't exist in groupedExercises, create an empty array for it
        if (!groupedExercises[workoutExercise.exerciseName]) {
          groupedExercises[workoutExercise.exerciseName] = []
        }

        // Push the current workout into the array for this exercise name
        groupedExercises[workoutExercise.exerciseName].push(workout)
      }
    }

    // console.log(groupExercisesByName)


    return groupedExercises;
  };

  return (
    <Box className="workout-container"
    >
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
        Workout History
      </Typography>

      {Object.keys(groupedWorkouts).map((date) => {
        const exercisesGroupedByDate = groupExercisesByName(groupedWorkouts[date]);

        return (
          <Accordion key={date} sx={{ width: '100%', marginBottom: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${date}-content`}
              id={`panel-${date}-header`}
              sx={{
                backgroundColor: '#00796b',
                color: '#fff',
              }}
            >
              <Typography variant="h6">{date}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#21122d" }}>
              {Object.keys(exercisesGroupedByDate).map((exerciseName) => (
                <Accordion key={exerciseName} sx={{ width: '100%', marginBottom: 2, backgroundColor: '#21122d' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`exercise-panel-${exerciseName}-content`}
                    id={`exercise-panel-${exerciseName}-header`}
                    sx={{
                      backgroundColor: '#21122d',
                      color: 'white',
                    }}
                  >
                    <Typography variant="h6">{exerciseName}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {exercisesGroupedByDate[exerciseName].map((workout, index) => (
                      <Card
                        key={index}
                        sx={{
                          width: '100%',
                          marginBottom: 2,
                          backgroundColor: '#f9f9f9',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <CardContent>
                          <Typography variant="body2"><strong>Sets:</strong> {workout.sets}</Typography>
                          <Typography variant="body2"><strong>Weight:</strong> {workout.weight}</Typography>
                          <Typography variant="body2"><strong>Reps:</strong> {workout.reps}</Typography>
                          <Typography variant="body2"><strong>Miles:</strong> {workout.miles}</Typography>
                          <Typography variant="body2"><strong>Pace:</strong> {workout.pace}</Typography>
                          <Typography variant="body2"><strong>Notes:</strong> {workout.notes}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default WorkoutGrid;
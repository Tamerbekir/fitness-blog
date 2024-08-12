import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, Autocomplete, TextField } from "@mui/material";
import { QUERY_ME, QUERY_EXERCISE } from "../../../utils/queries";
import { UPDATE_WORKOUT } from "../../../utils/mutations";
import "./workoutGrid.css";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";

const WorkoutGrid = () => {
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
      //refetch the update to reflect live
      refetch();
    },
    onError: (error) => {
      console.error("Error updating workout:", error);
      //this console error shows us the error as a string. Will keep for now
      // console.log("error details", JSON.stringify(error))
    },
  });

  if (loading || loadingExercise) return <p>Loading workouts...</p>;
  if (error || errorExercise) return <p>{error.message || errorExercise.message}</p>;
  if (!data || !dataExercise) return <p>No workout data found</p>;

  const workouts = data.me.workouts;
  const exercises = dataExercise.exercises;

  //we make groupedWorkouts an empty object so we can push our workouts into it
  const groupedWorkouts = {};

  //using a for loop to iterate over each of the users workout and group them by the date
  for (let i = 0; i < workouts.length; i++) {
    // First, we create a date variable by converting the createdAt timestamp fround in data.me to a Date object
    const date = new Date(parseInt(workouts[i].createdAt));
    //we then take date object and turn it into a string using the properties of our choosing
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    //then we say, if there is no grouped workout by said formatted date, push the workout into a empty array
    if (!groupedWorkouts[formattedDate]) {
      // IF there is a grouped workout by said formatted date, we push the iterated workout into the existing array
      groupedWorkouts[formattedDate] = {};
    }

    // Staying within our for loop iterating over the workouts, we then iterate over a second time to gain access to the exercise names

    //iterate over each workout index with an exercise
    for (let j = 0; j < workouts[i].exercise.length; j++) {
      //we create a variable for the exercise name to make handling easy.
      //we say the exercise name will be the workout at said index with exercise as said index, will be the exercise name
      const exerciseName = workouts[i].exercise[j].exerciseName;

      //if there are NO grouped workouts with said formatted date AND said exercise name, then put them into an array
      if (!groupedWorkouts[formattedDate][exerciseName]) {
        groupedWorkouts[formattedDate][exerciseName] = [];
      }

      //IF there is a grouped workout with an existing date AND exercise name, then push the iterated workout into the existing array
      groupedWorkouts[formattedDate][exerciseName].push(workouts[i]);
    }
  }

  //! Without a for loop, getting exerciseNames using map
  // const groupExercisesByName = workouts.map(workout => {
  //   return workout.exercise.map(index => index.exerciseName)
  // })



  //handling the edit click. When the user clicks the edit button, it will take in a parameter we call 'workout' which is an object that contains all of the details about the workout we are about to edit..
  const handleEditClick = (workout) => {
    // then we apply it to our useState setEditingWorkoutId and give it the parameter name 'workout' and give it an _id
    //This tells the application which workout is currently being edited.
    setEditingWorkoutId(workout._id);
    // Then from our useState we pass in the parameter 'workout' as well as exercise. We apply the parameter to our exercise 
    setEditWorkoutInfo({
      //then we take our parameter with the details we have from the workout._id and spread them here
      ...workout,
      //This represents the exercise field in the workout object.
      //we access the first element in the array, which is the exercise the user is editing in the array. Without exercise[0] we will get 'object, object' as a return. This is because JavaScript will look for ALL objects in an array unless we specify it. So, [0] will allow us to access the first and only object in the exercise array for this edited workout
      exercise: workout.exercise[0].exerciseName
    });
  };

  //handling the input changes via text field
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
  }

  return (
    <Box className="workout-container">

      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
        Workout History
      </Typography>

      {/* Grouping workouts by their date, mapping over each grouped workout */}
      {Object.keys(groupedWorkouts).map((date) => (
        <Accordion key={date} sx={{ width: "100%", marginBottom: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${date}-content`}
            id={`panel-${date}-header`}
            sx={{
              backgroundColor: "#00796b",
              color: "#fff",
            }}
          >
            <Typography variant="h6">{date}</Typography>
          </AccordionSummary>


          <AccordionDetails sx={{ backgroundColor: "#21122d" }}>
            {/* Grouping workouts by their exercise name while being nested within the grouped by dates. We map over the grouped workouts by their date and access the exercise name */}
            {Object.keys(groupedWorkouts[date]).map((exerciseName) => (
              <Accordion key={exerciseName} sx={{ width: "100%", marginBottom: 2, backgroundColor: '#21122d' }}>
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

                {/* After we map over the grouped workouts by their date and exercise name, we can now use them */}
                <AccordionDetails>
                  {groupedWorkouts[date][exerciseName].map((workout, index) => (
                    <Card
                      key={index}
                      sx={{
                        width: "100%",
                        marginBottom: 2,
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <CardContent>
                        {/* if the workout we are editing matches the id, show editing ability */}
                        {editingWorkoutId === workout._id ? (
                          <div>
                            <Autocomplete
                              style={{ backgroundColor: "transparent" }}
                              className="exercise-select"
                              // we have to make map out query in exercise to get access to our exercise names (variable defined above)
                              options={exercises.map((exercise) => exercise.exerciseName)}
                              getOptionLabel={(option) => option}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="filled"
                                  label="Search an Activity"
                                  margin="normal"
                                  InputProps={{
                                    ...params.InputProps,
                                    style: {
                                      color: "white", // Text color
                                    },
                                  }}
                                  InputLabelProps={{
                                    style: {
                                      color: "#00796b", // Label color
                                    },
                                  }}
                                  sx={{
                                    "& .MuiFilledInput-underline:before": {
                                      borderBottomColor: "#21122d", // Default border color
                                    },
                                    "& .MuiFilledInput-underline:hover:before": {
                                      borderBottomColor: "#00796b", // Hovered border color
                                    },
                                    "& .MuiFilledInput-underline:after": {
                                      borderBottomColor: "#00796b", // Focused border color
                                    },
                                  }}
                                />
                              )}
                              // Our exercise object, if the user devices to change the name
                              value={editWorkoutInfo.exercise}
                              onChange={(event, newValue) =>
                                setEditWorkoutInfo({
                                  ...editWorkoutInfo,
                                  exercise: newValue,
                                })
                              }
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
                            <TextField
                              label="Sets"
                              variant="filled"
                              type="text"
                              name="sets"
                              value={editWorkoutInfo.sets}
                              onChange={handleWorkoutChange}
                              InputProps={{
                                style: {
                                  color: "white", // Text color
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  color: "#00796b", // Label color
                                },
                              }}
                              sx={{
                                "& .MuiFilledInput-underline:before": {
                                  borderBottomColor: "#21122d", // Default border color
                                },
                                "& .MuiFilledInput-underline:hover:before": {
                                  borderBottomColor: "#00796b", // Hovered border color
                                },
                                "& .MuiFilledInput-underline:after": {
                                  borderBottomColor: "#00796b", // Focused border color
                                },
                                backgroundColor: "#21122d",
                                border: "4px solid white",
                                borderRadius: "12px",
                              }}
                            />
                            <TextField
                              label="Weight"
                              variant="filled"
                              type="text"
                              name="weight"
                              value={editWorkoutInfo.weight}
                              onChange={handleWorkoutChange}
                              InputProps={{
                                style: {
                                  color: "white", // Text color
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  color: "#00796b", // Label color
                                },
                              }}
                              sx={{
                                "& .MuiFilledInput-underline:before": {
                                  borderBottomColor: "#21122d", // Default border color
                                },
                                "& .MuiFilledInput-underline:hover:before": {
                                  borderBottomColor: "#00796b", // Hovered border color
                                },
                                "& .MuiFilledInput-underline:after": {
                                  borderBottomColor: "#00796b", // Focused border color
                                },
                                backgroundColor: "#21122d",
                                border: "4px solid white",
                                borderRadius: "12px",
                              }}
                            />
                            <TextField
                              label="Reps"
                              variant="filled"
                              type="text"
                              name="reps"
                              value={editWorkoutInfo.reps}
                              onChange={handleWorkoutChange}
                              InputProps={{
                                style: {
                                  color: "white", // Text color
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  color: "#00796b", // Label color
                                },
                              }}
                              sx={{
                                "& .MuiFilledInput-underline:before": {
                                  borderBottomColor: "#21122d", // Default border color
                                },
                                "& .MuiFilledInput-underline:hover:before": {
                                  borderBottomColor: "#00796b", // Hovered border color
                                },
                                "& .MuiFilledInput-underline:after": {
                                  borderBottomColor: "#00796b", // Focused border color
                                },
                                backgroundColor: "#21122d",
                                border: "4px solid white",
                                borderRadius: "12px",
                              }}
                            />
                            <TextField
                              label="Miles"
                              variant="filled"
                              type="text"
                              name="miles"
                              value={editWorkoutInfo.miles}
                              onChange={handleWorkoutChange}
                              InputProps={{
                                style: {
                                  color: "white", // Text color
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  color: "#00796b", // Label color
                                },
                              }}
                              sx={{
                                "& .MuiFilledInput-underline:before": {
                                  borderBottomColor: "#21122d", // Default border color
                                },
                                "& .MuiFilledInput-underline:hover:before": {
                                  borderBottomColor: "#00796b", // Hovered border color
                                },
                                "& .MuiFilledInput-underline:after": {
                                  borderBottomColor: "#00796b", // Focused border color
                                },
                                backgroundColor: "#21122d",
                                border: "4px solid white",
                                borderRadius: "12px",
                              }}
                            />
                            <TextField
                              label="Pace"
                              variant="filled"
                              type="text"
                              name="pace"
                              value={editWorkoutInfo.pace}
                              onChange={handleWorkoutChange}
                              InputProps={{
                                style: {
                                  color: "white", // Text color
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  color: "#00796b", // Label color
                                },
                              }}
                              sx={{
                                "& .MuiFilledInput-underline:before": {
                                  borderBottomColor: "#21122d", // Default border color
                                },
                                "& .MuiFilledInput-underline:hover:before": {
                                  borderBottomColor: "#00796b", // Hovered border color
                                },
                                "& .MuiFilledInput-underline:after": {
                                  borderBottomColor: "#00796b", // Focused border color
                                },
                                backgroundColor: "#21122d",
                                border: "4px solid white",
                                borderRadius: "12px",
                              }}
                            />
                            <TextField
                              label="Notes"
                              variant="filled"
                              type="text"
                              name="notes"
                              value={editWorkoutInfo.notes}
                              onChange={handleWorkoutChange}
                              InputProps={{
                                style: {
                                  color: "white", // Text color
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  color: "#00796b", // Label color
                                },
                              }}
                              sx={{
                                "& .MuiFilledInput-underline:before": {
                                  borderBottomColor: "#21122d", // Default border color
                                },
                                "& .MuiFilledInput-underline:hover:before": {
                                  borderBottomColor: "#00796b", // Hovered border color
                                },
                                "& .MuiFilledInput-underline:after": {
                                  borderBottomColor: "#00796b", // Focused border color
                                },
                                backgroundColor: "#21122d",
                                border: "4px solid white",
                                borderRadius: "12px",
                              }}
                            />
                            <Button onClick={handleSaveEdit}>Save</Button>
                            <Button onClick={() => setEditingWorkoutId(false)}>Cancel</Button>
                          </div>


                          //continue conditional
                        ) : (

                          // else.. if the exercise doe not match the editing id, just show the users information from their workout
                          <>
                            <Typography variant="body2">
                              <strong>Exercise:</strong>{" "}
                              {workout.exercise.map((exercise) => exercise.exerciseName).join(", ")}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Sets:</strong> {workout.sets}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Weight:</strong> {workout.weight}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Reps:</strong> {workout.reps}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Miles:</strong> {workout.miles}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Pace:</strong> {workout.pace}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Notes:</strong> {workout.notes}
                            </Typography>
                            {/* If the user clicks on the handle edit button, and the editingWorkoutId === the workout._id the edit form will show (editingWorkoutId) and as well as the save and cancel option and the user informaiton will  */}
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleEditClick(workout)}
                            >
                              Edit Workout
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion >
      ))}
    </Box >
  );
};

export default WorkoutGrid;
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../../utils/queries";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const WorkoutGrid = () => {

  const { loading, error, data, refetch } = useQuery(QUERY_ME);

  if (loading) return <p>Loading workoutGrid..</p>;
  if (error) return <p>{error}</p>
  if (!data) return <p>Data for grid not found</p>;

  const rows = data.me.workouts.map((workout, index) => ({
    id: index + 1,
    weight: workout.weight,
    reps: workout.reps,
    sets: workout.sets,
    miles: workout.miles,
    pace: workout.pace,
    notes: workout.notes,
    createdAt: workout.createdAt,
    exercises: workout.exercise.map((exercise) => exercise.exerciseName),
  }));

  const columns = [
    { field: "id", headerName: "Workout", width: 70 },
    { field: "exercises", headerName: "Exercises", width: 100, editable: false },
    { field: "sets", headerName: "Sets", width: 50, editable: true },
    { field: "weight", headerName: "Weight", width: 70, editable: true },
    { field: "reps", headerName: "Reps", width: 50, editable: true },
    { field: "miles", headerName: "Miles", width: 60, editable: true },
    { field: "pace", headerName: "Pace", width: 60, editable: true },
    { field: "createdAt", headerName: "Date", width: 100, editable: false },
    { field: "notes", headerName: "Notes", width: 100, editable: true },
  ];




  return (
    <div>
      <h1>Workout</h1>
        <Box sx={{ height: 400, width: "90%" }}>
          <DataGrid
            refetch={refetch}
            className="workoutGrid"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
    </div>
  )
}

export default WorkoutGrid
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CardHeader,
  Select,
  MenuItem,
  Divider,
  Popover,
  MenuList,
} from "@mui/material";
import { TaskItem } from "../components/TaskItem";
import TaskHeader from "../components/TaskHeader";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../hooks/use-app-context";
import { filter } from "lodash";
import CreateTask from "./CreateTask";
import { Iconify } from "../components/iconify/iconify";
import { useAuthContext, useBoolean } from "../hooks";

export default function TaskDashboard() {
  const { logOut } = useAuthContext()
  const { state, dispatch, onDelete, onStatusChange, onFilterByUserId } = useAppContext()

  const { tasks, users, open } = state

  // const todo = 

  useEffect(() => {
    // alert("change")
    console.log("DISPACTH")
  }, [dispatch])

  // const todo = filter(tasks,t=>t.status)


  function TasksBlock({ count, items, title, badgeColor = 'secondary', sx }) {
    return (
      <Grid item xs={12} md={4}>
        <Stack spacing={1.5}>
          <TaskHeader color={badgeColor} content={count} title={title} />
          <Card
            sx={{
              p: 2,
              border: '1px dashed',
              borderRadius: 2,
              minHeight: 120,
              ...sx
            }}
          >
            {count > 0 ? (
              items.map((task) => <TaskItem onDelete={onDelete} onStatusChange={onStatusChange} key={task.id} task={task} />)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tasks available under this section
              </Typography>
            )}
          </Card>
        </Stack>
      </Grid>

    )
  }


  const toggleCreate = (e) => {
    dispatch({ type: "TOGGLE_CREATE", payload: !open });
  }

  const [assignee, setAssignee] = useState('all')

  const filter = useBoolean()

  return (
    <Container maxWidth="xl" disableGutters sx={{ mt: 4 }}>

      <Card>

        {/* Carries top Info */}
        <CardHeader title={<Typography variant="h4">Task Dashboard</Typography>} subheader={
          <Typography color="text.secondary">
            Manage your tasks efficiently
          </Typography>}
          action={<Stack direction="row" spacing={2}>
            <Button
              color="inherit"
              variant="outlined"
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={filter.onTrue}
              sx={{ textTransform: 'capitalize' }}
            >
              {assignee}
            </Button>

            <Button onClick={toggleCreate} variant="contained" color="primary">
              + New Task
            </Button>
            <Button startIcon={<Iconify icon='lets-icons:sign-out-circle' />} onClick={logOut} variant="contained" color="error">
              Logout
            </Button>
          </Stack>}
        />


        {/* Wrapper for main UI logic */}
        <CardContent>
          <Grid container spacing={3}>
            <TasksBlock
              count={tasks?.todo?.length || 0}
              items={tasks?.todo} title='To Do'
              badgeColor="primary" sx={{ bgcolor: (theme) => theme.palette.grey[300] }} />
            {/* The colors i defined in them  -> bgcolor: (theme) => theme.palette.grey[300] and more*/}

            <TasksBlock count={tasks?.in_progress?.length || 0} items={tasks?.in_progress} title='In Progress' badgeColor="info" sx={{ bgcolor: (theme) => theme.palette.info.lighter }} />
            <TasksBlock count={tasks?.done?.length || 0} items={tasks?.done} title='Done' badgeColor="success" sx={{ bgcolor: (theme) => theme.palette.success.lighter }} />
          </Grid>
        </CardContent>
      </Card>

      <CreateTask />

      <Popover open={filter.value}>
        <MenuList>
          {users?.data?.map((user) => (
            <MenuItem onClick={() => {
              filter.onFalse()
              setAssignee(user?.username)
              onFilterByUserId(user?.id)
              // onChangeStatus(option.value);
            }}
              key={user?.id} value={user?.id} selected={user.id === assignee}>
              {user?.username}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </Container>
  );
}

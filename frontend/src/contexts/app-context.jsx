import { createContext, useReducer, useCallback, useEffect } from "react";
import axios, { endpoints } from "../utilities/axios";

const initialState = {
  tasks: {
    todo: [],
    progress: [],
    done: [],
    todo: [],
    loading: false,
    error: null,
  },
  users: {
    data: [],
    loading: false,
    error: null,
  },
  open: false
};

function appReducer(state, action) {
  switch (action.type) {
    case "GET_TASKS_INIT":
      return { ...state, tasks: { ...state.tasks, loading: true, error: null } };
    case "GET_TASKS_SUCCESS":
      return { ...state, tasks: { ...state.tasks, loading: false, [action.status]: action.payload.data } };
    case "GET_TASK_ERROR":
      return { ...state, tasks: { ...state.tasks, loading: false, error: action.payload } };
    case "GET_USERS_OK":
      return { ...state, users: { ...state.users, loading: false, ...action.payload } };
    case "TOGGLE_CREATE":
      return { ...state, open: action.payload };
    default:
      return state;
  }
}

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [state, dispatch] = useReducer(appReducer, initialState);


  const getTasks = useCallback(async (status, assignee = null) => {
    dispatch({ type: "GET_TASKS_INIT" });
    try {
      const res = await axios.get(endpoints.tasks, {
        params: {
          status,
          assignee
        }
      });
      dispatch({ type: "GET_TASKS_SUCCESS", payload: res.data, status });
    } catch (err) {
      console.log(err)
      dispatch({ type: "GET_TASK_ERROR", payload: err.message });
    }
  }, []);



  const getUsers = useCallback(async () => {
    try {
      const res = await axios.get(endpoints.users);
      dispatch({ type: "GET_USERS_OK", payload: res.data });
    } catch (err) {
      console.error(err);
    }
  }, []);


  const createTask = async ({ title, description, dueDate, assignee }) => {
    try {
      const data = { title, description, dueDate, assignee }

      const res = await axios.post(endpoints.tasks, data);

      const { status, message } = res.data;

      if (!status) {
        throw new Error(message);
      }

      getTasks('todo');

      getTasks('done');

      getTasks('in_progress');
      return { status, message };
    } catch (err) {
      console.error(err);
      throw err
    }
  }
  const onDelete = async (id) => {
    try {

      const res = await axios.delete(endpoints.taskId(id));

      const { status, message } = res.data;

      if (!status) {
        throw new Error(message);
      }

      getTasks('todo');

      getTasks('done');

      getTasks('in_progress');
      return { status, message };
    } catch (err) {
      console.error(err);
      throw err
    }
  }
  const onStatusChange = async (id, status) => {
    try {

      const res = await axios.put(endpoints.taskId(id), { status });

      const response = res.data;

      if (!response.status) {
        throw new Error(response.message);
      }

      getTasks('todo');

      getTasks('done');

      getTasks('in_progress');
      return response
    } catch (err) {
      console.error(err);
      throw err
    }
  }

  const onFilterByUserId = async (assigneeId) => {
    getTasks('todo', assigneeId);

    getTasks('done', assigneeId);

    getTasks('in_progress', assigneeId);
  }

  useEffect(() => {
    getTasks('todo');

    getTasks('done');

    getTasks('in_progress');

    getUsers();

  }, [getTasks, getUsers]);

  return (
    <AppContext.Provider value={{ state, dispatch, getTasks, getUsers, onFilterByUserId, createTask, onDelete, onStatusChange }}>
      {children}
    </AppContext.Provider>
  );
};

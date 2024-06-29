import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TasksType = {
  _id: string;
  title: string;
  description: string;
  status: string;
  userId: string;
  createdAt: string;
  dueDate: string;
};

export type UserType = {
  id: string;
  username: string;
  email: string;
  linkedinUrl: string;
  profileImageUrl:string
  tasks: TasksType[];
};

export type UpdateTaskPayload = {
  taskId: string;
  updates: Partial<TasksType>;
};

const initialState = {
  user: JSON.parse(localStorage.getItem("user") as string),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<UserType>) {
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.user = action.payload;
    },
    deleteUser(state) {
      localStorage.removeItem("user");
      state.user = {} as UserType;
    },
    updateTask(state, action: PayloadAction<UpdateTaskPayload>) {
      const { taskId, updates } = action.payload;
      const task = state.user.tasks.find(
        (task: TasksType) => task._id === taskId
      );
      if (task) {
        Object.assign(task, updates);
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    addTask(state, action: PayloadAction<TasksType>) {
      state.user.tasks.push(action.payload);
    
      localStorage.setItem("user", JSON.stringify(state.user));
    }
    
  },
});

export const { addUser, deleteUser, updateTask, addTask } = userSlice.actions;

export default userSlice.reducer;

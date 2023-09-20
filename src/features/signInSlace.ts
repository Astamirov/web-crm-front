import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

type User = {
  _id: string;
  login: string;
  password: string;
  isAdmin: boolean;
  isMentor: boolean;
  isStudent: boolean;
  result: number;
};

type stateApp = {
  user: User;
  error: null | string | unknown;
  signIn: boolean;
  token: string | null;
};

const initialState: stateApp = {
  user: {
    _id: "",
    login: "",
    password: "",
    isAdmin: false,
    isMentor: false,
    isStudent: false,
    result: 0
  },
  error: null,
  signIn: false,
  token: localStorage.getItem("token"),
};

export const authSignIn = createAsyncThunk<
  string,
  User,
  { rejectValue: unknown; state: RootState }
>("auth/signin", async ({ login, password }, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });
    const token = await res.json();
    if (token.error) {
      return thunkAPI.rejectWithValue(token.error);
    }
    localStorage.setItem("token", token.token);
    return token.token;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

const singInSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authSignIn.pending, (state) => {
        (state.signIn = true), (state.error = null);
      })
      .addCase(authSignIn.rejected, (state, action) => {
        (state.error = action.payload), (state.signIn = false);
      })
      .addCase(authSignIn.fulfilled, (state, action) => {
        (state.signIn = false),
          (state.error = null),
          (state.token = action.payload);
        state.user.login = action.meta.arg.login;
        state.user._id = action.meta.arg._id;
      });
  },
});

export default singInSlice.reducer;
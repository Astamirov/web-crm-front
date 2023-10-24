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
  group: string;
};

type StateUsers = {
  users: User[];
  oneUser: User[];
  error: null | string | unknown;
  signUp: boolean;
};

const initialState: StateUsers = {
  users: [],
  oneUser: [],
  error: null,
  signUp: false,
};

//один юзер
export const oneUser = createAsyncThunk<
  User[],
  void,
  { rejectValue: unknown; state: RootState }
>("users/one", async (_, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:3000/oneUser", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${thunkAPI.getState().signInSlice.token}`,
      },
    });
    const users = await res.json();
    return users;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

//удаление юзера
export const deleteUser = createAsyncThunk<
User, string, { rejectValue: unknown, state: RootState }
>("user/delete",async (_id, thunkAPI) => {
  console.log(_id)
  try {
    const res = await fetch(`http://localhost:3000/api/user/${_id}`, {
      method: "DELETE",
      headers: {
        
        Authorization: `Bearer ${thunkAPI.getState().signInSlice.token}`
      }
    })
    const user = await res.json()
    return user
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(error);
  }
})

//изменение result
export const patchResult = createAsyncThunk<
  User[], string,
  { rejectValue: unknown, state: RootState }
>("user/patchResult", async (_, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:3000/userResult", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${thunkAPI.getState().signInSlice.token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const authSignUp = createAsyncThunk<
  string,
  User,
  { rejectValue: unknown; state: RootState }
>("auth/signup", async ({ login, password , group}, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password, group }),
    });
    const json = await res.json();
    if (json.error) {
      return thunkAPI.rejectWithValue(json.error);
    }
    return json;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

//отображение всех юзеров
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: unknown; state: RootState }
>("users/fetch", async (_, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:3000/api/users");
    const users = await res.json();
    return users;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((item) => item._id !== action.meta.arg)
    })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(oneUser.fulfilled, (state, action) => {
        state.oneUser = action.payload;
      })
      .addCase(patchResult.fulfilled, (state, action) => {
        state.oneUser = action.payload;
      })
      .addCase(authSignUp.pending, (state) => {
        (state.signUp = true), (state.error = null);
      })
      .addCase(authSignUp.rejected, (state, action) => {
        (state.signUp = false), (state.error = action.payload);
      })
      .addCase(authSignUp.fulfilled, (state, action) => {
        state.users = action.payload
        state.signUp = false,
        state.error = null;
      })
  },
});

export default usersSlice.reducer;

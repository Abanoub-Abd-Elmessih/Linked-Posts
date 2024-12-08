/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginData } from "../../Interfaces/LoginData";
import { UserDataInterface } from "../../Interfaces/UserData";

export const login = createAsyncThunk('Auth/login', async (values: LoginData)=>{
    const response = await axios.post('https://linked-posts.routemisr.com/users/signin', values);
    return response;
});

export const getUserData = createAsyncThunk('Auth/getUserData', async ()=>{
  try {
    const response = await axios.get('https://linked-posts.routemisr.com/users/profile-data', {
      headers: {
        token: localStorage.getItem('token')
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

// New async thunk for uploading user photo


interface AuthState {
  token: string;
  isLoading: boolean;
  isError: boolean;
  error: string;
  isSuccess: boolean;
  userData: UserDataInterface | null;
}

// Initial state
const initialState: AuthState = {
  token: localStorage.getItem('token') || '',
  isLoading: false,
  isError: false,
  error: '',
  isSuccess: false,
  userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') as string) : null,
};

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = "";
      state.userData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    }
  },
  extraReducers(builder){
    // Handle Login
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.data.token;
      state.isSuccess = true;
      state.isError = false;
      state.isLoading = false;
      state.error = '';
      localStorage.setItem('token', action.payload.data.token);
    })
    .addCase(login.pending, (state) => {
      state.token = '';
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = true;
      state.error = '';
    })
    .addCase(login.rejected, (state, action: any) => {
      state.token = '';
      state.isSuccess = false;
      state.isError = true;
      state.isLoading = false;
      state.error = action.error.message ?? 'Incorrect email or password';
    })
    // Handle User Data
    .addCase(getUserData.fulfilled, (state, action) => {
      state.userData = action.payload.user;
      console.log('User Data:', action.payload.user);
      localStorage.setItem('userData', JSON.stringify(action.payload.user));
    })
    .addCase(getUserData.rejected, (state, action: any) => {
      state.userData = null;
      state.error = action.payload?.message ?? 'Failed to fetch user data';
    })
  }
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginData } from "../../Interfaces/LoginData";

export const login = createAsyncThunk('Auth/login', async (values: LoginData)=>{
    return await axios.post('https://linked-posts.routemisr.com/users/signin',values)
})

export const authSlice = createSlice({
  name: "Auth",
  initialState: {
    token: localStorage.getItem('token') || '',
    isLoading:false,
    isError:false,
    error:'',
    isSuccess:false,
  },
  reducers: {
    logout(state) {
      state.token = "";
      state.isSuccess = false;
      localStorage.removeItem("token");
    }
  },
  extraReducers(builder){
    builder.addCase(login.fulfilled,(state,action:any) => {
        state.token = action.payload.data.token;
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
        state.error = '';
        localStorage.setItem('token', action.payload.data.token)
    })
    builder.addCase(login.pending,(state) => {
        state.token = '';
        state.isSuccess = false;
        state.isError = false;
        state.isLoading = true;
        state.error = '';
    })
    builder.addCase(login.rejected,(state,action:any) => {
        state.token = '';
        state.isSuccess = false;
        state.isError = true;
        state.isLoading = false;
        state.error = action.error.response ?? 'incorrect email or password' ;
    })
  }
});
export const { logout } = authSlice.actions
export const authReducer = authSlice.reducer;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { changePasswordInterface } from "../../Interfaces/LoginData";
import axios from "axios";

export const changePassFunction = createAsyncThunk(
    "Pass/changePassFunction",
    async (values: changePasswordInterface) => {
      try {
        const response = await axios.patch(
          "https://linked-posts.routemisr.com/users/change-password",
          values, // Sending values in the body
          {
            headers: {
              token: localStorage.getItem("token") || "", // Adding token in headers
            },
          }
        );
        console.log(response)
        return response.data; // Return the full response data
      } catch (error: any) {
        console.error(error.response?.data || error.message);
        throw error.response?.data || error.message; // Throw the error for further handling
      }
    }
  );
  
  

interface PassState {
  token: string;
  isLoading: boolean;
  isError: boolean;
  error: string;
  isSuccess: boolean;
}
const initialState: PassState = {
  token: localStorage.getItem("token") || "",
  isLoading: false,
  isError: false,
  error: "",
  isSuccess: false,
};



export const passSlice = createSlice({
    name: "Pass",
    initialState,
    reducers: {
        resetSuccessState: (state) => {
            state.isSuccess = false;
            state.error = "";
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(changePassFunction.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
          state.error = "";
          state.isSuccess = false;
        })
        .addCase(changePassFunction.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.error = "";
          state.token = action.payload.token; // Update the token in the state
          localStorage.setItem("token", action.payload.token); // Save the token in localStorage
        })
        .addCase(changePassFunction.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.error = action.error.message || "Something went wrong!";
        });
    },
  });
  export const { resetSuccessState } = passSlice.actions;
  export const passReducer = passSlice.reducer 

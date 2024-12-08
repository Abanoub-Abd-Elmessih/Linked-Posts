/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserData } from "./AuthSlice";
import axios from "axios";
import { UserDataInterface } from "../../Interfaces/UserData";

export const uploadUserPhoto = createAsyncThunk(
    'Profile/uploadUserPhoto', 
    async (formData: FormData, { dispatch }) => {
      try {
        const response = await axios.put(
          'https://linked-posts.routemisr.com/users/upload-photo', 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'token': localStorage.getItem('token') || ''
            }
          }
        );
        await dispatch(getUserData());
        
        return response.data;
      } catch (error) {
        console.error('Error uploading photo', error);
        throw error;
      }
    }
  );

  interface ProfileState {
    userData: UserDataInterface | null; // You can replace 'any' with your actual user data type
    isLoading: boolean;
    error: string | null;
  }
  
  const initialState: ProfileState = {
    userData: null, // Assuming initially no data is available
    isLoading: false,
    error: null,
  };
  

  export const profileSlice = createSlice({
    name: "Profile",
    initialState,
    reducers: {
    },
    extraReducers(builder){
      // Handle Photo Upload
      builder.addCase(uploadUserPhoto.fulfilled, (_state, action) => {
        console.log('Photo uploaded successfully', action.payload);
        // The photo will be updated via getUserData that's called in the thunk
      })
      .addCase(uploadUserPhoto.rejected, (state, action: any) => {
        state.error = action.error.message ?? 'Failed to upload photo';
      });
    }
  });
  
  export const profileReducer = profileSlice.reducer;
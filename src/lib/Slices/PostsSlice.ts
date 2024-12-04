/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const getPosts = createAsyncThunk('posts/getPosts',async(limit:number = 50)=>{
    return await axios.get(`https://linked-posts.routemisr.com/posts?limit=${limit}`,{
        headers:{
            token:localStorage.getItem("token")
        }
    })
})

const postsSlice = createSlice({
    name:'posts',
    initialState:{
        posts:[]
    },
    reducers:{},
    extraReducers(builder){
        builder.addCase(getPosts.fulfilled, (state,action:any)=>{
            state.posts = action.payload.data.posts
        })
    }
})
export const postsReducer = postsSlice.reducer
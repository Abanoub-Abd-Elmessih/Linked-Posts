import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slices/AuthSlice";
import { postsReducer } from "./Slices/PostsSlice";
import { profileReducer } from "./Slices/ProfileSlice";

export const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postsReducer,
        profile: profileReducer,
        }
})

export type AppDispatch = typeof store.dispatch
export type GlobalState = ReturnType<typeof store.getState>
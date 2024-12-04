import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slices/AuthSlice";
import { postsReducer } from "./Slices/PostsSlice";

export const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postsReducer,
    }
})

export type AppDispatch = typeof store.dispatch
export type GlobalState = ReturnType<typeof store.getState>
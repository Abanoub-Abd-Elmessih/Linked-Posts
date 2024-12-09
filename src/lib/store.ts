import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slices/AuthSlice";
import { postsReducer } from "./Slices/PostsSlice";
import { profileReducer } from "./Slices/ProfileSlice";
import { passReducer } from "./Slices/changePasswordSlice";

export const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postsReducer,
        profile: profileReducer,
        pass:passReducer,
        }
})

export type AppDispatch = typeof store.dispatch
export type GlobalState = ReturnType<typeof store.getState>

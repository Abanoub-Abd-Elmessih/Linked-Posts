    /* eslint-disable @typescript-eslint/no-explicit-any */
    import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
    import axios from "axios";


    export const getPosts = createAsyncThunk('posts/getPosts', async (limit: number = 50) => {
        const paginationResponse = await axios.get('https://linked-posts.routemisr.com/posts?limit=50', {
            headers: {
                token: localStorage.getItem("token") || '',
            }
        });
    
        const numberOfPages = paginationResponse.data.paginationInfo.numberOfPages;
            return await axios.get(`https://linked-posts.routemisr.com/posts?page=${numberOfPages}&limit=${limit}`, {
            headers: {
                token: localStorage.getItem("token") || '',
            }
        });
    })
    export const getSinglePost = createAsyncThunk('posts/getSinglePost',async(postId:string)=>{
        return await axios.get(`https://linked-posts.routemisr.com/posts/${postId}`,{
            headers:{
                token:localStorage.getItem("token") || '',
            }
        })
    })

    const postsSlice = createSlice({
        name:'posts',
        initialState:{
            posts:[],
            singlePost:null,
            isLoading:false,
        },
        reducers:{},
        extraReducers(builder){
            // Handle Posts
            builder.addCase(getPosts.fulfilled, (state,action:any)=>{
                // state.posts = action.payload.data.posts
                state.isLoading = false;
                state.posts = action.payload.data.posts.sort(
                    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            });
            builder.addCase(getPosts.pending, (state) => {
                state.isLoading = true;
            });
            builder.addCase(getPosts.rejected, (state) => {
                state.isLoading = false;
            });
            // Handle single Post
            builder.addCase(getSinglePost.fulfilled,(state,action:any)=>{
                state.isLoading=false
                state.singlePost = action.payload.data.post
            })
            builder.addCase(getSinglePost.pending, (state)=>{
                state.isLoading=true
            })
            builder.addCase(getSinglePost.rejected, (state) => {
                state.isLoading = false;
            });
        }
    })
    export const postsReducer = postsSlice.reducer
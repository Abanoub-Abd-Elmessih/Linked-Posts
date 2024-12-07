import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { AppDispatch, GlobalState } from "../lib/store";
import { useEffect } from "react";
import { getSinglePost } from "../lib/Slices/PostsSlice";
import Loading from "../Components/Loading";
import PostDetailsCard from "../Components/PostDetailsCard";
import { Container } from "@mui/material";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const {singlePost , isLoading} = useSelector((state:GlobalState)=>state.posts)
  console.log(singlePost);
  
  const dispatch = useDispatch<AppDispatch>()
  useEffect(()=>{
  if (id) {
    dispatch(getSinglePost(id));
  }
  },[dispatch, id])

  if (isLoading) {
    return <Loading/>
  }
  return (
    <Container maxWidth='xl'>
      {singlePost && (
            <PostDetailsCard post={singlePost} />
      )}
    </Container>
  )
}
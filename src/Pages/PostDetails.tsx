import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { AppDispatch, GlobalState } from "../lib/store";
import { useEffect } from "react";
import { getSinglePost } from "../lib/Slices/PostsSlice";
import Loading from "../Components/Loading";
import { Container } from "@mui/material";
import CardComponent from "../Components/CardComponent";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const {singlePost } = useSelector((state:GlobalState)=>state.posts)
  console.log(singlePost);
  
  const dispatch = useDispatch<AppDispatch>()
  useEffect(()=>{
  if (id) {
    dispatch(getSinglePost(id));
  }
  },[dispatch, id])

  return (
    <Container maxWidth="md">
    {/* Only render CardComponent if singlePost is not null */}
    {singlePost ? (
      <CardComponent post={singlePost} showAllComments={true} />
    ) : (
      <Loading />
    )}
  </Container>
  )
}
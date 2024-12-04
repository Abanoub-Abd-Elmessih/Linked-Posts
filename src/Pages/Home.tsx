import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPosts } from "../lib/Slices/PostsSlice";
import { AppDispatch, GlobalState } from "../lib/store";
import CardComponent from "../Components/CardComponent";
import { postInterface } from '../Interfaces/Posts';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts }:{posts:postInterface[]} = useSelector((state: GlobalState) => state.posts);
  useEffect(() => {
    dispatch(getPosts(50));
  }, [dispatch]);
  return (
    <Container maxWidth="md">
      {posts.map((post)=> <CardComponent key={post._id} post={post} />)}
      
    </Container>
  );
}

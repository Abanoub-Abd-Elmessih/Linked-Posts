import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPosts } from "../lib/Slices/PostsSlice";
import { AppDispatch, GlobalState } from "../lib/store";
import CardComponent from "../Components/CardComponent";
import { postInterface } from "../Interfaces/Posts";
import Loading from "../Components/Loading";
import { getUserData } from "../lib/Slices/AuthSlice";
import AddPostComp from "../Components/AddPostComp";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading }: { posts: postInterface[]; isLoading:boolean } = useSelector(
    (state: GlobalState) => state.posts
  );
  const { token, userData } = useSelector(
    (state: GlobalState) => state.auth
  );
  
  useEffect(() => {
    if (posts.length === 0) {
      dispatch(getPosts(50));
    }
    if (token && !userData) {
      dispatch(getUserData());
    }
  }, [dispatch,posts,token,userData]);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <Container maxWidth="sm" sx={{paddingY:5}}>
      <AddPostComp/>
      {posts.map((post) => (
        <CardComponent key={post._id} post={post} />
      ))}
    </Container>
  );
}


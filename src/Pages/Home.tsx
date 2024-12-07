import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPosts } from "../lib/Slices/PostsSlice";
import { AppDispatch, GlobalState } from "../lib/store";
import CardComponent from "../Components/CardComponent";
import { postInterface } from "../Interfaces/Posts";
import Loading from "../Components/Loading";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading }: { posts: postInterface[]; isLoading:boolean } = useSelector(
    (state: GlobalState) => state.posts
  );
  
  useEffect(() => {
    if (posts.length === 0) {
      dispatch(getPosts(50));
    }
  }, [dispatch,posts]);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <Container maxWidth="sm">
      {posts.map((post) => (
        <CardComponent key={post._id} post={post} />
      ))}
    </Container>
  );
}


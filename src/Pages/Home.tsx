import { Box, Button, Container, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPosts } from "../lib/Slices/PostsSlice";
import { AppDispatch, GlobalState } from "../lib/store";
import CardComponent from "../Components/CardComponent";
import { postInterface } from "../Interfaces/Posts";
import Loading from "../Components/Loading";
import { getUserData } from "../lib/Slices/AuthSlice";
import AddPostComp from "../Components/AddPostComp";
import CloseIcon from "@mui/icons-material/Close";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [createPost, setCreatePost] = useState(false);
  const { posts, isLoading }: { posts: postInterface[]; isLoading: boolean } =
    useSelector((state: GlobalState) => state.posts);
  const { token, userData } = useSelector((state: GlobalState) => state.auth);

  useEffect(() => {
    if (posts.length === 0 && !isLoading) {
      dispatch(getPosts(50));
    }
    if (token && !userData) {
      dispatch(getUserData());
    }
  }, [dispatch, posts, token, userData, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="sm" sx={{ paddingY: 5 }}>
      {!createPost && (
        <Button
          variant="outlined"
          onClick={() => setCreatePost(true)}
          className="w-full"
        >
          Create Post
        </Button>
      )}
      {userData && createPost && (
        <Box
          sx={{
            border: "1.5px solid #D7D3BF",
            padding: 3,
            textAlign:'end'
          }}
        >
          <IconButton onClick={()=>setCreatePost(false)}>
            <CloseIcon/>
          </IconButton>
          <AddPostComp />
        </Box>
      )}
      {posts.map((post) => (
        <CardComponent key={post._id} post={post} />
      ))}
    </Container>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import { Box, Button } from "@mui/material";
import { red } from "@mui/material/colors";
import { postInterface } from "../Interfaces/Posts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserDataInterface } from "../Interfaces/UserData";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../lib/store";
import { getPosts, getSinglePost } from "../lib/Slices/PostsSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Formik, Form } from "formik";
import Inputs from "./Inputs";
import * as Yup from "yup";

const userDataString = localStorage.getItem("userData");
const userId: UserDataInterface | null = userDataString
  ? JSON.parse(userDataString)
  : null;

export default function PostDetailsCard({ post }: { post: postInterface }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [makeComment, setMakeComment] = useState(false);

  if (!post) return <Typography>No Post Found</Typography>;

  async function deleteComment(commentId: string) {
    try {
      const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        {
          headers: {
            token: localStorage.getItem("token") || "",
          },
        }
      );
      if (data.message === "success") {
        toast.success("Comment deleted successfully");
        dispatch(getSinglePost(post._id));
        dispatch(getPosts(50));
      }
    } catch (error: any) {
      toast.error("Failed to delete Comment", error);
    }
  }

  async function deletePost(postId: string) {
    try {
      const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        {
          headers: {
            token: localStorage.getItem("token") || "",
          },
        }
      );
      if (data.message === "success") {
        toast.success("Post deleted successfully");
        dispatch(getPosts(50));
        navigate("/");
      }
    } catch (error: any) {
      toast.error("Failed to delete post", error);
    }
  }

  async function createComment(values: { content: string; post: string }) {
    try {
      const { data } = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        values,
        {
          headers: {
            token: localStorage.getItem("token") || "",
          },
        }
      );
      if (data.message === "success") {
        toast.success("Comment Posted Successfully");
        dispatch(getSinglePost(post._id));
        setMakeComment(false);
      }
    } catch (error: any) {
      toast.error("Failed to post comment", error);
    }
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: { xs: "0", sm: "20px" },
        marginY: "20px",
      }}
    >
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{
            width: { xs: "100%", lg: "70%" },
            height: { xs: "auto", sm: "800px" },
            objectFit: { xs: "contain", sm: "cover" },
            borderRadius: "5px",
          }}
        />
      )}

      {/* User Info */}
      <Box
        sx={{
          width: post.image ? { xs: "100%", lg: "30%" } : "100%",
          border: "1px solid #ECEBDE",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={post.user.photo}
              alt={post.user.name}
              sx={{ cursor: "pointer" }}
            />
          }
          action={
            userId?._id === post.user._id && (
              <>
                <IconButton
                  aria-label="delete"
                  onClick={() => deletePost(post._id)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
              </>
            )
          }
          title={post.user.name}
          subheader={new Date(post.createdAt).toLocaleString()}
          titleTypographyProps={{ sx: { cursor: "pointer" } }}
        />

        {/* Post Body */}
        <CardContent>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", wordBreak: "break-word" }}
          >
            {post.body}
          </Typography>
        </CardContent>

        {/* Actions */}
        <CardActions
          disableSpacing
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #ECEBDE",
            borderBottom: "1px solid #ECEBDE",
          }}
        >
          <IconButton aria-label="like">
            <FavoriteIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Like
            </Typography>
          </IconButton>

          <IconButton
            aria-label="comment"
            onClick={() => setMakeComment(!makeComment)}
          >
            <InsertCommentIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Comment
            </Typography>
          </IconButton>

          <IconButton aria-label="share">
            <ShareIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Share
            </Typography>
          </IconButton>
        </CardActions>

        {/* Comments */}
        {makeComment && (
          <Box sx={{border:'1px solid #D7D3BF', m:2,p:2 , borderRadius:2}}>
          <Formik
            initialValues={{ content: "", post: post._id }}
            validationSchema={Yup.object({
              content: Yup.string()
                .required("Content is required")
                .min(2, "Comment must be at least 2 characters long"),
            })}
            onSubmit={(values, { resetForm }) => {
              createComment(values);
              resetForm();
            }}
          >
            {({ handleChange, values, errors }) => (
              <Form>
                <Inputs
                  label="Enter your comment"
                  name="content"
                  type="text"
                  value={values.content}
                  onChange={handleChange}
                />
                {errors.content && (
                  <Typography color="error">{errors.content}</Typography>
                )}
                {/* <button type="submit">Submit</button> */}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mt: 2 }}
                >
                  {"Post Comment"}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
        )}

        {post.comments?.map((comment) => (
          <Box
            key={comment._id}
            sx={{
              border: "0.5px solid #D7D3BF",
              borderRadius: "5px",
              bgcolor: "#F1F1F1",
              paddingBottom: 2,
              marginY: "10px",
              marginX: "7px",
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  src={comment.commentCreator.photo}
                  alt={comment.commentCreator.name}
                  sx={{ cursor: "pointer", bgcolor: red[500] }}
                />
              }
              action={
                userId?._id === post.user._id && (
                  <>
                    <IconButton
                    aria-label="delete"
                    onClick={() => deleteComment(comment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }
              title={comment.commentCreator.name}
              subheader={new Date(comment.createdAt).toLocaleString()}
              titleTypographyProps={{ sx: { cursor: "pointer" } }}
            />
            <Typography sx={{ pl: 9, fontWeight: 600 }}>
              {comment.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

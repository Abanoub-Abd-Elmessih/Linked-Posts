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
import { postInterface } from "../Interfaces/Posts";
import { Box, Button } from "@mui/material";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { UserDataInterface } from "../Interfaces/UserData";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { getPosts } from "../lib/Slices/PostsSlice";
import { AppDispatch } from "../lib/store";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Inputs from "./Inputs";

interface CardComponentProps {
  post: postInterface;
}
const userDataString = localStorage.getItem("userData");
const userId: UserDataInterface | null = userDataString
  ? JSON.parse(userDataString)
  : null;

export default function CardComponent({ post }: CardComponentProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [makeComment, setMakeComment] = useState(false);
  const [makeEditComment, setMakeEditComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  async function deleteComment(commentId: string) {
    try {
      const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.message == "success") {
        toast.success("Comment deleted successfully");
        dispatch(getPosts(50));
      }
    } catch (error: any) {
      toast.error("failed to delete comment", error);
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
        dispatch(getPosts(50));
        setMakeComment(false);
      }
    } catch (error: any) {
      toast.error("Failed to post comment", error);
    }
  }
  async function editComment(values: { content: string }, commentId: string) {
    try {
      const { data } = await axios.put(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        values,
        {
          headers: {
            token: localStorage.getItem("token") || "",
          },
        }
      );
      if (data.message === "success") {
        toast.success("Comment Edited Successfully");
        dispatch(getPosts(50));
        setMakeEditComment(false);
        setEditingCommentId(null);
      }
    } catch (error: any) {
      toast.error("Failed to edit comment", error);
    }
  }

  return (
    <Card sx={{ marginY: "25px" }}>
      <CardHeader
        onClick={() => navigate(`/PostDetails/${post._id}`)}
        className="hover:bg-slate-100 duration-300 ease-in-out cursor-pointer"
        avatar={
          <Avatar
            src={post.user.photo}
            alt={post.user.name}
            sx={{ cursor: "pointer" }}
            aria-label="recipe"
          />
        }
        title={post.user.name}
        subheader={
          <>
            {new Date(post.createdAt).toLocaleDateString()}
            {userId?._id === post.user._id && (
              <Typography
                sx={{
                  display: "inline",
                  marginLeft: 1,
                  color: "primary.main",
                  bgcolor: "#D7D3BF",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              >
                Your Post
              </Typography>
            )}
          </>
        }
        titleTypographyProps={{ style: { cursor: "pointer" } }}
      />

      <CardContent>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", wordBreak: "break-word" }}
        >
          {post.body}
        </Typography>
      </CardContent>
      {post.image && (
        <CardMedia
          component="img"
          height="194"
          image={post.image}
          alt="Paella dish"
        />
      )}
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "space-between",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex flex-1 items-center justify-center">
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
            <p className="text-base ms-2">Like</p>
          </IconButton>
        </div>
        <div className="border-x border-gray-400 flex flex-1 items-center justify-center">
          <IconButton
            aria-label="Comment on post"
            onClick={() => setMakeComment(!makeComment)}
          >
            <InsertCommentIcon />
            <p className="text-base ms-2">Comment</p>
          </IconButton>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <IconButton aria-label="share">
            <ShareIcon />
            <p className="text-base ms-2">Share</p>
          </IconButton>
        </div>
      </CardActions>

      {/* Comments */}
      {makeComment && (
        <Box sx={{ border: "1px solid #D7D3BF", m: 2, p: 2, borderRadius: 2 }}>
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
                  autoFocus={true}
                />
                {errors.content && (
                  <Typography color="error">{errors.content}</Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mt: 2 }}
                >
                  Post Comment
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      )}

      {post.comments[0] && (
        <Box
          sx={{
            border: "0.5px solid #D7D3BF",
            borderRadius: "5px",
            bgcolor: "#F1F1F1",
            paddingBottom: 2,
            marginTop: "10px",
          }}
        >
          <CardHeader
            sx={{ paddingBottom: "5px" }}
            avatar={
              <Avatar
                src={post.comments[0].commentCreator.photo}
                alt={post.comments[0].commentCreator.name}
                sx={{ cursor: "pointer", bgcolor: red[500] }}
                aria-label="recipe"
              />
            }
            action={
              <>
                {userId?._id === post.user._id && (
                  <IconButton
                    aria-label="delete"
                    onClick={() => deleteComment(post.comments[0]._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                {userId?._id === post.comments[0].commentCreator._id && (
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setMakeEditComment(true);
                      setEditingCommentId(post.comments[0]._id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </>
            }
            title={post.comments[0].commentCreator.name}
            subheader={post.comments[0].createdAt}
            titleTypographyProps={{ style: { cursor: "pointer" } }}
          />
          <Typography
            sx={{ paddingLeft: 9, fontWeight: 600, margin: 0 }}
            component={"p"}
          >
            {post.comments[0].content}
          </Typography>


          {/* Edit Comment Form */}
          {makeEditComment && editingCommentId === post.comments[0]._id && (
            <Box
              sx={{ border: "1px solid #D7D3BF", m: 2, p: 2, borderRadius: 2 }}
            >
              <Formik
                initialValues={{ content: post.comments[0].content }}
                validationSchema={Yup.object({
                  content: Yup.string()
                    .required("Content is required")
                    .min(2, "Comment must be at least 2 characters long"),
                })}
                onSubmit={(values, { resetForm }) => {
                  editComment(values, post.comments[0]._id);
                  resetForm();
                }}
              >
                {({ handleChange, values, errors }) => (
                  <Form>
                    <Inputs
                      label="Edit your comment"
                      name="content"
                      type="text"
                      value={values.content}
                      onChange={handleChange}
                      autoFocus={true}
                    />
                    {errors.content && (
                      <Typography color="error">{errors.content}</Typography>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ mt: 2 }}
                    >
                      Update Comment
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ mt: 2, ml: 2 }}
                      onClick={() => {
                        setMakeEditComment(false);
                        setEditingCommentId(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
}

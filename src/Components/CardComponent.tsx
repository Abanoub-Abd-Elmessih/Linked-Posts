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
import { Box, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Inputs from "./Inputs";

interface CardComponentProps {
  post: postInterface;
}
const userId = JSON.parse(localStorage.getItem("userData") || '{}');

export default function CardComponent({ post }: CardComponentProps) {
  const navigate = useNavigate();
  const [makeComment, setMakeComment] = useState(false);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllComments(post._id);
  }, [post._id]);

  async function getAllComments(postId: string) {
    try {
      const { data } = await axios.get(
        `https://linked-posts.routemisr.com/posts/${postId}/comments`,
        {
          headers: {
            token: localStorage.getItem("token") || "",
          },
        }
      );
      setTotalComments(data.total);
    } catch (error) {
      console.error(error);
    }
  }
  async function createComment(values: { content: string; post: string }) {
    setLoading(true)
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
        setMakeComment(false);
        getAllComments(post._id)
      }
    } catch (error: any) {
      toast.error("Failed to post comment", error);
    }finally{
      setLoading(false)
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
          alt={post.user.name}
        />
      )}
      <Typography
        sx={{
          color: "text.secondary",
          wordBreak: "break-word",
          textAlign: "end",
          padding: "5px",
          fontSize: "14px",
        }}
      >
        <Link to={`/PostDetails/${post._id}`}>
          {totalComments == 0 ? "" : `${totalComments} comments`}
        </Link>
      </Typography>
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
            onSubmit={(values) => {
              createComment(values);
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
                  <Typography color="error" sx={{padding:'5px'}}>{errors.content}</Typography>
                )}
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ mt: 2 }}
                  className="w-full"
                  disabled={loading}
                >
                  {loading? <CircularProgress size={"30px"} /> : 'Post Comment'}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Card>
  );
}

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
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import { Box, Button, CircularProgress } from "@mui/material";
import { red } from "@mui/material/colors";
import { Comment, postInterface } from "../Interfaces/Posts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserDataInterface } from "../Interfaces/UserData";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../lib/store";
import { getPosts } from "../lib/Slices/PostsSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Inputs from "./Inputs";
import * as Yup from "yup";

export default function PostDetailsCard({ post }: { post: postInterface }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [makeComment, setMakeComment] = useState(false);
  const [makeEditComment, setMakeEditComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [theComments, setTheComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState<UserDataInterface | null>(null);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    const userIdFromStorage: UserDataInterface | null = userDataString
      ? JSON.parse(userDataString)
      : null;
    setUserId(userIdFromStorage);
    if (userIdFromStorage) {
      getAllComments(post._id);
    }
  }, [post._id]);

  if (!post) return <Typography>No Post Found</Typography>;

  async function deletePost(postId: string) {
    try {
      const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
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

  async function getAllComments(postId: string) {
    setCommentsLoading(true);
    try {
      const { data } = await axios.get(
        `https://linked-posts.routemisr.com/posts/${postId}/comments`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setTheComments(data.comments);
      setTotalComments(data.total);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }

  async function deleteComment(commentId: string) {
    setCommentsLoading(true);
    try {
      const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.message === "success") {
        await getAllComments(post._id);
        toast.success("Comment deleted successfully");
      }
    } catch (error: any) {
      toast.error("Failed to delete Comment", error);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function createComment(values: { content: string; post: string }) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        values,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.message === "success") {
        await getAllComments(post._id);
        setMakeComment(false);
        toast.success("Comment Posted Successfully");
      }
    } catch (error: any) {
      toast.error("Failed to post comment", error);
    } finally {
      setLoading(false);
    }
  }

  async function editComment(values: { content: string }, commentId: string) {
    setCommentsLoading(true);
    try {
      const { data } = await axios.put(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        values,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.message === "success") {
        await getAllComments(post._id);
        setMakeEditComment(false);
        setEditingCommentId(null);
        toast.success("Comment Edited Successfully");
      }
    } catch (error: any) {
      toast.error("Failed to edit comment", error);
    } finally {
      setCommentsLoading(false);
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
            objectFit: { xs: "contain", sm: "contain" },
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
        <Typography
          sx={{
            color: "text.secondary",
            wordBreak: "break-word",
            textAlign: "end",
            padding: "5px",
            fontSize: "14px",
          }}
        >
          {totalComments == 0 ? "" : `${totalComments} comments`}
        </Typography>

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
        </CardActions>

        {/* Create Comment */}
        {makeComment && (
          <Box
            sx={{ border: "1px solid #D7D3BF", m: 2, p: 2, borderRadius: 2 }}
          >
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
                    <Typography color="error" sx={{paddingTop:2}}>{errors.content}</Typography>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mt: 2 }}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={"30px"} /> : 'Post Comment'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        )}

        {/* Comments */}
        {commentsLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: 2 
            }}
          >
            <CircularProgress />
          </Box>
        ) : theComments.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              No comments yet. Be the first to comment!
            </Typography>
          </Box>
        ) : (
          theComments?.map((comment) => (
            <Box
              key={comment._id}
              sx={{
                border: "0.5px solid #D7D3BF",
                borderRadius: "5px",
                bgcolor: "#F1F1F1",
                marginY: "10px",
                marginX: "7px",
                opacity: commentsLoading ? 0 : 1,
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src={comment.commentCreator.photo}
                    alt={comment.commentCreator.name}
                    sx={{ cursor: "pointer", bgcolor: red[500]}}
                  />
                }
                action={
                  <>
                    {userId?._id === post.user._id ? (
                      <IconButton
                        aria-label="delete"
                        onClick={() => deleteComment(comment._id)}
                        disabled={commentsLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      ""
                    )}
                    {userId?._id === comment.commentCreator._id ? (
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          setMakeEditComment(true);
                          setEditingCommentId(comment._id);
                        }}
                        disabled={commentsLoading}
                      >
                        <EditIcon />
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </>
                }
                title={comment.commentCreator.name}
                subheader={new Date(comment.createdAt).toLocaleString()}
                titleTypographyProps={{ sx: { cursor: "pointer" } }}
              />
              {makeEditComment && editingCommentId === comment._id ? (
                <Box sx={{ border: "1px solid #D7D3BF", m: 2, p: 2, borderRadius: 2 , bgcolor:'white' }}>
                  <Formik
                    initialValues={{ content: comment.content }}
                    validationSchema={Yup.object({
                      content: Yup.string()
                        .required("Content is required")
                        .min(2, "Comment must be at least 2 characters long"),
                    })}
                    onSubmit={(values) => {
                      editComment(values, comment._id);
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
                          autoFocus
                        />
                        {errors.content && (
                          <Typography color="error" sx={{paddingTop:2}}>{errors.content}</Typography>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          sx={{ mt: 2 }}
                          disabled={commentsLoading}
                          className="w-full"
                        >
                          {commentsLoading ? <CircularProgress size={"30px"} /> : 'Edit Comment'}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Box>
              ) : (
                <CardContent sx={{padding:0}}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", wordBreak: "break-word" , fontWeight:700 , ml:9, px:'2px'}}
                  >
                    {comment.content}
                  </Typography>
                </CardContent>
              )}
            </Box>
          ))
        )}
      </Box>
    </Card>
  )};
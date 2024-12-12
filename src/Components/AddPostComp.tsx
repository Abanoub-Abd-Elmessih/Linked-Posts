/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Inputs from "./Inputs";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getPosts } from "../lib/Slices/PostsSlice";
import { AppDispatch } from "../lib/store";

export default function AddPostComp() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { name } = JSON.parse(localStorage.getItem("userData") || "{}");
  const dispatch = useDispatch<AppDispatch>()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);

      // Generate a preview URL for the selected image
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  async function onSubmit(e: any) {
    e.preventDefault();

    if (body.trim() === "") {
      toast.error("Post content can't be empty or spaces only.");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("body", body);
      if (image != null) {
        formData.append("image", image);
      }
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data);
      if (data.message == "success") {
        setImage(null);
        setPreviewUrl("");
        setBody("");
        toast.success("Post add successfully");
        dispatch(getPosts(50))
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed sending post Image is to large");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      sx={{
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography sx={{ textAlign: "center" , m:0, padding:0 }} component={"h2"} variant="h4">
        Create Post
      </Typography>
        <Box
          sx={{
            width: { xs: "60%", sm: "50%" },
            height: "4px",
            background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
            marginY: "4px",
            marginX: "auto",
          }}
        />
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Inputs
          label={`What's on your mind , ${name}`}
          name="postBody"
          type="text"
          value={body}
          variant="outlined"
          multiline={true}
          rows={4}
          required={true}
          onChange={(e) => setBody(e.target.value)}
        />
        <Box
          sx={{
            border: "1px solid #D7D3BF",
            borderRadius: "5px",
            padding: 2,
          }}
        >
          <input
            id="createPostImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="createPostImage">
            <Button sx={{ width: "100%" }} variant="contained" component="span">
              {!previewUrl ? "Choose Photo" : "Change Photo ?"}
            </Button>
          </label>
          {previewUrl && (
            <>
              <img
                src={previewUrl}
                alt={name}
                className="w-full block cursor-pointer m-auto my-5"
                onDoubleClick={() => {
                  setImage(null);
                  setPreviewUrl("");
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", textAlign: "center" }}
              >
                Double Click The image to remove it
              </Typography>
            </>
          )}
        </Box>
        <Button variant="contained" type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress size="30px" /> : "Post"}
        </Button>
      </form>
    </Box>
  );
}

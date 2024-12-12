/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Typography } from "@mui/material";
import Inputs from "./Inputs";
import { useState } from "react";

export default function AddPostComp() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { name } = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);

      // Generate a preview URL for the selected image
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  function onSubmit(e: any) {
    e.preventDefault();
  }
  console.log(image);
  

  return (
    <Box
      sx={{
        border: "1.5px solid #D7D3BF",
        padding: 3,
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography sx={{ textAlign: "center" }} component={"h2"} variant="h5">
        Create Post
      </Typography>
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
          accept="image/*"
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
            accept="image/jpg,image/jpeg,image/png"
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
                className="w-full block m-auto my-5"
                onDoubleClick={() => {
                  setImage(null);
                  setPreviewUrl("");
                }}
              />
              <Typography variant="body2" sx={{ fontStyle: "italic", textAlign:'center' }}>
                Double Click The image to remove it
              </Typography>
            </>
          )}
        </Box>
        <Button variant="contained" type="submit">
          Post
        </Button>
      </form>
    </Box>
  );
}

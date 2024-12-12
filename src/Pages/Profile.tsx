/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../lib/store";
import { uploadUserPhoto } from "../lib/Slices/ProfileSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import CardComponent from "../Components/CardComponent";
import { postInterface } from "../Interfaces/Posts";

export default function Profile() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: GlobalState) => state.auth);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<postInterface[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userData?._id) {
      getUserPosts(userData?._id);
    }
  }, [userData?._id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    setIsPhotoLoading(true);

    try {
      await dispatch(uploadUserPhoto(formData) as any).unwrap();
      toast.success("Profile photo updated successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading file", error);
      toast.error("Failed Image is Too Large");
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const getUserPosts = async (userId: string) => {
    setIsPostsLoading(true);
    try {
      const { data } = await axios.get(
        `https://linked-posts.routemisr.com/users/${userId}/posts`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsPostsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ py: 5, px: { xs: "0px", sm: "30px" } }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          gap={4}
        >
          {/* Profile Picture and Name */}
          <Box textAlign="center" flexBasis="33%">
            <Avatar
              src={previewUrl || userData?.photo}
              alt={userData?.name}
              sx={{
                width: 150,
                height: 150,
                border: "3px solid #e0e0e0",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                mx: "auto",
              }}
            />
            <Typography
              variant="h5"
              sx={{ mt: 2, fontWeight: 600, color: "primary.main" }}
            >
              {userData?.name}
            </Typography>
            <Box className="p-3 flex flex-col justify-center items-center gap-3">
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="profile-photo-upload">
                <Button variant="contained" component="span">
                  Choose Profile Photo
                </Button>
              </label>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePhotoUpload}
                disabled={!selectedFile || isPhotoLoading}
                className="w-3/4"
              >
                {isPhotoLoading ? <CircularProgress size="25px" /> : "Upload Photo"}
              </Button>
            </Box>
          </Box>

          {/* User Details */}
          <Box
            flexBasis="67%"
            width={"90%"}
            sx={{ border: "1px solid #ECEBDE", borderRadius: "10px" }}
          >
            <Formik
              initialValues={{
                name: userData?.name || "",
                email: userData?.email || "",
                dateOfBirth: userData?.dateOfBirth || "",
                gender: userData?.gender || "",
                createdAt: userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : "N/A",
              }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values }) => (
                <Form>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Profile Information
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Name:</strong> {values.name || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Email:</strong> {values.email || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Birthday:</strong> {values.dateOfBirth || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Gender:</strong> {values.gender || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Joined:</strong> {values.createdAt}
                    </Typography>
                  </CardContent>
                </Form>
              )}
            </Formik>
            <Button variant="contained" color="primary" sx={{ ml: 2, mb: 2 }}>
              <Link to={"/changePassword"}>Change Password</Link>
            </Button>
          </Box>
        </Box>
      </Card>
      <Container
        maxWidth="md"
        sx={{
          border: "1.5px solid #D7D3BF",
          my: 3,
          borderRadius: "10px",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          className="text-center"
          sx={{ mt: 3 }}
        >
          Your Posts
        </Typography>
        <Box
          sx={{
            width: { xs: "50%", sm: "20%" },
            height: "4px",
            background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
            marginY: "4px",
            marginX: "auto",
          }}
        />
        {isPostsLoading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <CardComponent key={post._id} post={post} />
          ))
        ) : (
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ my: 3, color: "text.secondary" }}
          >
            You don't have posts yet. Start Sharing now
          </Typography>
        )}
      </Container>
    </Container>
  );
}
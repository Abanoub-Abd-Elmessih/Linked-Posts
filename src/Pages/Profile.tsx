/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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

export default function Profile() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: GlobalState) => state.auth);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Generate a preview URL for the selected image
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

    setIsLoading(true); // Set loading to true when upload starts

    try {
      // Dispatch the upload action from the auth slice
      await dispatch(uploadUserPhoto(formData) as any).unwrap();
      toast.success("Profile photo updated successfully!");
      setSelectedFile(null);
      setPreviewUrl(null); // Clear the preview after upload
    } catch (error) {
      console.error("Error uploading file", error);
      toast.error("Failed Image is Too Large");
    } finally {
      setIsLoading(false); // Set loading to false when upload finishes
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
                disabled={!selectedFile || isLoading} 
                className="w-3/4"
              >
                {isLoading ? <CircularProgress size="25px" /> : "Upload Photo"}
              </Button>
            </Box>
          </Box>

          {/* User Details */}
          <Box
            flexBasis="67%"
            width={'90%'}
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
            <Button variant="contained" color="primary" sx={{ml:2, mb:2}}>
              <Link to={"/changePassword"}>Change Password</Link>
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}

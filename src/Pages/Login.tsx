/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Formik, Form, } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Inputs from "../Components/Inputs";
import { useNavigate } from "react-router-dom";
import ErrorMessageComp from "../Components/ErrorMessageComp";
import { useState } from "react";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
});

export default function Login() {
  const [existingUser, setExistingUser] = useState("");
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        values
      );
      console.log("API Response:", response.data);
      navigate("/");
    } catch (error: any) {
      setExistingUser(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange }) => (
        <Form className="max-w-2xl md:mx-auto p-6 shadow-xl rounded-lg my-10 mx-4">
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography
              component="h1"
              variant="h3"
              className="text-center pb-3"
            >
              Login
            </Typography>

            {/* Email */}
            <Inputs
              label="Email"
              type="text"
              name="email"
              onChange={handleChange}
              value={values.email}
            />
            <ErrorMessageComp name="email" />
            {existingUser && (
              <Alert severity="warning" className="mb-4">
                {existingUser}
              </Alert>
            )}
            {/* Password */}
            <Inputs
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              value={values.password}
            />
            <ErrorMessageComp name="password" />
            {/* Submit Button */}
            <Button variant="contained" type="submit" className="w-full">
              Login
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

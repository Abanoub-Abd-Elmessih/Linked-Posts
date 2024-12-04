/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Inputs from "../Components/Inputs";
import { useNavigate } from "react-router-dom";
import ErrorMessageComp from "../Components/ErrorMessageComp";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[@$!%*?&#]/, "Password must contain a special character"),
  rePassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  dateOfBirth: Yup.date()
    .required("Date of Birth is required")
    .test("is-older-than-16", "You must be at least 16 years old", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 16; // Only compares the years
    }),
  gender: Yup.string().required("Gender is required"),
});

export default function Registration() {
  const [existingUser, setExistingUser] = useState("");
  const {token} = useSelector((state:RootState)=>state.auth)
  const navigate = useNavigate();
  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token,navigate])
  const initialValues = {
    name: "",
    email: "",
    password: "",
    rePassword: "",
    dateOfBirth: "",
    gender: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );
      console.log("API Response:", response.data);
      navigate("/login");
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
        <Form className="max-w-2xl md:mx-auto border border-gray-200 p-6 shadow-xl rounded-lg my-10 mx-4">
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography
              component="h1"
              variant="h3"
              className="text-center pb-3"
            >
              Registration
            </Typography>
            {/* Name */}
            <Inputs
              label="Name"
              type="text"
              name="name"
              onChange={handleChange}
              value={values.name}
            />
            <ErrorMessageComp name="name" />

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

            {/* Confirm Password */}
            <Inputs
              label="Confirm Password"
              type="password"
              name="rePassword"
              onChange={handleChange}
              value={values.rePassword}
            />
            <ErrorMessageComp name="rePassword" />

            {/* Date of Birth */}
            <TextField
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              label="Birthday"
              variant="filled"
              value={values.dateOfBirth}
              onChange={handleChange}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <ErrorMessageComp name="dateOfBirth" />

            {/* Gender */}
            <FormControl variant="filled" fullWidth className="mb-2">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Field
                as={Select}
                name="gender"
                labelId="gender-label"
                value={values.gender}
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Field>
              <ErrorMessageComp name="gender" />
            </FormControl>

            {/* Submit Button */}
            <Button variant="contained" type="submit" className="w-full">
              Submit
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

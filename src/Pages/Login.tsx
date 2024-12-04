import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Inputs from "../Components/Inputs";
import { useNavigate } from "react-router-dom";
import ErrorMessageComp from "../Components/ErrorMessageComp";
import { useEffect } from "react";
import { LoginData } from "../Interfaces/LoginData";
import { login } from "../lib/Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, GlobalState } from "../lib/store";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, isError, isLoading, token } = useSelector(
    (state: GlobalState) => state.auth
  );
  const initialValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    if (token != "") {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = (values: LoginData) => {
    dispatch(login(values));
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
              className="text-center"
            >
              Login
            </Typography>
            <Box
              sx={{
                width: { xs: '50%', sm: '30%' },
                height: "4px",
                background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
                marginY: "4px",
                marginX: 'auto',
              }}
            />
            {/* Email */}
            <Inputs
              label="Email"
              type="text"
              name="email"
              onChange={handleChange}
              value={values.email}
            />
            <ErrorMessageComp name="email" />
            {/* Password */}
            <Inputs
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              value={values.password}
            />
            <ErrorMessageComp name="password" />
            {isError && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            {/* Submit Button */}
            <Button
              disabled={isLoading}
              variant="contained"
              type="submit"
              className="w-full"
            >
              {isLoading ? <CircularProgress size={"30px"} /> : "Login"}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

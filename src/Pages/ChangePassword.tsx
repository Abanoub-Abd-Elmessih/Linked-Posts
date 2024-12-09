import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
  } from "@mui/material";
  import Inputs from "../Components/Inputs";
  import { Form, Formik } from "formik";
  import * as Yup from "yup";
  import { changePasswordInterface } from "../Interfaces/LoginData";
  import { AppDispatch, GlobalState } from "../lib/store";
  import { useDispatch, useSelector } from "react-redux";
  import { changePassFunction, resetSuccessState } from "../lib/Slices/changePasswordSlice";
  import { useNavigate } from "react-router-dom";
  import { useEffect } from "react";
  
  export default function ChangePassword() {
    const navigate = useNavigate();
    const validationSchema = Yup.object({
      password: Yup.string().required("Password is required"),
      newPassword: Yup.string()
        .required("Please Enter New Password")
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain an uppercase letter")
        .matches(/[a-z]/, "Password must contain a lowercase letter")
        .matches(/[0-9]/, "Password must contain a number")
        .matches(/[@$!%*?&#]/, "Password must contain a special character"),
    });
    
    const dispatch = useDispatch<AppDispatch>();
    const { isError, isLoading, error, isSuccess } = useSelector(
      (state: GlobalState) => state.pass
    );
    
    const initialValues = {
      password: "",
      newPassword: "",
    };
  
    const handleSubmit = (values: changePasswordInterface) => {
      dispatch(changePassFunction(values));
    };
    
    useEffect(() => {
        if (isSuccess) {
            navigate('/profile');
            dispatch(resetSuccessState())
      }
    }, [isSuccess, navigate,dispatch]);
  
    return (
      <Container>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, handleChange }) => (
            <Form className="max-w-2xl md:mx-auto p-6 shadow-xl rounded-lg my-10 mx-4">
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography component="h1" variant="h4" className="text-center">
                  Change Password
                </Typography>
                <Box
                  sx={{
                    width: { xs: "70%", sm: "50%" },
                    height: "4px",
                    background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
                    marginY: "4px",
                    marginX: "auto",
                  }}
                />
                <Inputs
                  label="Enter Current Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                />
                <Inputs
                  label="Enter New Password"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                />
                {isError && (
                  <Alert severity="error" className="mb-4">
                    {error} Wrong Password
                  </Alert>
                )}
                {isSuccess && (
                  <Alert severity="success" className="mb-4">
                    Password changed successfully!
                  </Alert>
                )}
                {/* Submit Button */}
                <Button
                  disabled={isLoading}
                  variant="contained"
                  type="submit"
                  className="w-full"
                >
                  {isLoading ? (
                    <CircularProgress size={"30px"} />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
  
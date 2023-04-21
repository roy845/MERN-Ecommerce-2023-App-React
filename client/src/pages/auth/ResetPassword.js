import React from "react";
import { useState } from "react";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/cursorStyles.css";
import "../../styles/errorStyles.css";
import "../../styles/successStyles.css";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Box,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RESET_PASSWORD_URL = "/api/v1/auth/reset-password";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ResetPassword = () => {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmedPasswordValid, setIsConfirmedPasswordValid] =
    useState(false);
  const [validationResults, setValidationResults] = useState({});
  const { token } = useParams();

  const navigate = useNavigate();

  // Define an object that stores the validation criteria and their respective regex patterns
  const validationCriteria = {
    "At least 8 characters long": /^.{8,}$/,
    "Contains at least one uppercase letter": /^(?=.*[A-Z]).+$/,
    "Contains at least one lowercase letter": /^(?=.*[a-z]).+$/,
    "Contains at least one number": /^(?=.*\d).+$/,
    "Contains at least one special character [#?!@$%^&*-]":
      /^.*[#?!@$%^&*\-~+-]+.*$/,
  };

  const validatePassword = (password) => {
    const validation = {};
    // Check each validation criteria against the password and store the result in an object
    Object.entries(validationCriteria).forEach(([criteria, regex]) => {
      validation[criteria] = password === "" ? false : regex.test(password);
    });

    setValidationResults(validation);
    console.log(validation);

    // Determine if all validation criteria are met
    const isValid = Object.values(validation).every(
      (result) => result === true
    );
    return isValid;
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsPasswordValid(validatePassword(e.target.value));
    setIsConfirmedPasswordValid(confirmPassword === e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsConfirmedPasswordValid(password === e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        RESET_PASSWORD_URL,
        JSON.stringify({ token, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response) console.log(response);

      toast.success("Reset password successfully", "success");
      navigate("/");
    } catch (err) {
      console.log(err);
      if (!err || !err.response) {
        toast.error("No Server Response");
      } else if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Send Mail Failed");
      }
    }

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={handlePasswordChange}
          />
          {password && (
            <Typography variant="caption">
              {Object.entries(validationCriteria).map(([criteria, _]) => (
                <span key={criteria}>
                  {validationResults[criteria] ? (
                    <span className="success">
                      <span className="icon">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>

                      <span className="text">{criteria}</span>
                    </span>
                  ) : (
                    <span className="error">
                      <span className="icon">
                        <FontAwesomeIcon icon={faTimes} />
                      </span>
                      <span className="text">{criteria}</span>
                    </span>
                  )}
                </span>
              ))}
            </Typography>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {confirmPassword && (
            <Typography variant="caption">
              {isConfirmedPasswordValid ? (
                <span className="success">
                  <span className="icon">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>

                  <span className="text">{"Passwords match"}</span>
                </span>
              ) : (
                <span className="error">
                  <span className="icon">
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <span className="text">{"Passwords Don't match"}</span>
                </span>
              )}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!isPasswordValid || !isConfirmedPasswordValid}
          >
            Reset Password
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          {"© "}
          {new Date().getFullYear()}
          {" Ecommerce App. All rights reserved."}
        </Typography>
      </Box>
    </Container>
  );
};

export default ResetPassword;

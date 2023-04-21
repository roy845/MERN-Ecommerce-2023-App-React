import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Link,
  Typography,
  Container,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/auth";
import axios from "axios";
import "../../styles/cursorStyles.css";
import "../../styles/errorStyles.css";
import "../../styles/successStyles.css";
import FooterExt from "../../components/FooterExt";
import toast from "react-hot-toast";
const LOGIN_URL = "/api/v1/auth/login";

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

const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const { auth, setAuth, setIsLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  let from = "/home";
  if (location.state && location.state.from && location.state.from.pathname) {
    from = location.state.from.pathname;
  }
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmail(validEmailRegex.test(inputEmail));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Fill in all the details");
    }

    try {
      const response = await axios.post(
        LOGIN_URL,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);

      if (response?.data?.success) {
        toast.success(response.data?.message);
        setIsLoading(true);
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });

        localStorage.setItem("auth", JSON.stringify(response.data));
      }

      navigate(from, { replace: true });

      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
      if (!err || !err.response) {
        toast.error("No Server Response");
      } else if (err.response?.status === 400) {
        toast.error("Missing Username or Password");
      } else if (err?.response?.status === 404) {
        toast.error(err?.response?.data.message);
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized");
      } else {
        toast.error("Login Failed");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />

          <Typography variant="caption">
            {email === "" ? null : !isValidEmail ? (
              <span className="error">
                <FontAwesomeIcon className="icon" icon={faTimes} />
                <span className="text">{"Invalid email address"}</span>
              </span>
            ) : (
              <span className="success">
                <FontAwesomeIcon className="icon" icon={faCheck} />
                <span className="text">{"Valid email address"}</span>
              </span>
            )}
          </Typography>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!isValidEmail || !password}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              <Link
                onClick={() => navigate("/forgot-password")}
                variant="body2"
                className="link-cursor"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                onClick={() => navigate("/register")}
                className="link-cursor"
                variant="body2"
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <FooterExt />
    </Container>
  );
};

export default Login;

import React from "react";
import Layout from "../../components/Layout";
import UserMenu from "../../components/UserMenu";
import { useAuth } from "../../context/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@material-ui/core";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../api/axios";
import toast from "react-hot-toast";

const UPDATE_USER_PROFILE_URL = "/api/v1/auth/profile";

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

const Profile = () => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmedPasswordValid, setIsConfirmedPasswordValid] =
    useState(false);

  const [validationResults, setValidationResults] = useState({});

  // Define an object that stores the validation criteria and their respective regex patterns
  const validationCriteria = {
    "At least 8 characters long": /^.{8,}$/,
    "Contains at least one uppercase letter": /^(?=.*[A-Z]).+$/,
    "Contains at least one lowercase letter": /^(?=.*[a-z]).+$/,
    "Contains at least one number": /^(?=.*\d).+$/,
    "Contains at least one special character [#?!@$%^&*-]":
      /^.*[#?!@$%^&*\-~+-]+.*$/,
  };

  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  const validatePassword = (password) => {
    const validation = {};
    // Check each validation criteria against the password and store the result in an object
    Object.entries(validationCriteria).forEach(([criteria, regex]) => {
      validation[criteria] = password === "" ? false : regex.test(password);
    });

    setValidationResults(validation);

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
      const { data } = await axios.put(UPDATE_USER_PROFILE_URL, {
        name,
        email,
        password,
        phone,
        address,
      });

      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-8">
            <div
              className="form-container"
              style={{ marginTop: "-40px", marginRight: "20rem" }}
            >
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <PersonOutlineOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    User Profile
                  </Typography>
                  <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      autoFocus
                      disabled
                    />

                    <TextField
                      variant="outlined"
                      margin="normal"
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
                        {Object.entries(validationCriteria).map(
                          ([criteria, _]) => (
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
                          )
                        )}
                      </Typography>
                    )}
                    <TextField
                      variant="outlined"
                      margin="normal"
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
                            <span className="text">
                              {"Passwords Don't match"}
                            </span>
                          </span>
                        )}
                      </Typography>
                    )}
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Phone"
                      autoComplete="phone"
                      autoFocus
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="address"
                      name="address"
                      label="Address"
                      autoComplete="address"
                      autoFocus
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      disabled={
                        (!isPasswordValid ||
                          !isConfirmedPasswordValid ||
                          !password ||
                          !confirmPassword ||
                          !name ||
                          !phone ||
                          !address) &&
                        (password || confirmPassword)
                      }
                    >
                      Update
                    </Button>
                  </form>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

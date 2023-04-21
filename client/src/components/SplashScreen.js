import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Audio } from "react-loader-spinner";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing(2),
  },
  text: {
    color: "#000",
  },
}));

const SplashScreen = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      </div>
    </div>
  );
};

export default SplashScreen;

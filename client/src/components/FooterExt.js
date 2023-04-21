import React from "react";
import { Typography, Box } from "@material-ui/core";
const FooterExt = () => {
  return (
    <Box mt={8}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"© "}
        {new Date().getFullYear()}
        {" Ecommerce App. All rights reserved."}
      </Typography>
    </Box>
  );
};

export default FooterExt;

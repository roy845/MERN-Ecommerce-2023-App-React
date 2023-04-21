import React from "react";
import Layout from "../components/Layout";
import { Box, Container, Typography } from "@mui/material";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
            tortor dolor. Fusce feugiat sapien in ligula cursus ultrices. Mauris
            fermentum, magna vel cursus tempor, magna lacus efficitur velit, in
            mattis quam enim eget sem. In euismod, quam a tempus interdum, eros
            enim mollis lorem, a consectetur lectus orci nec massa.
          </Typography>
          <Typography variant="body1" component="p">
            Nunc posuere mi id est sagittis, vel bibendum quam imperdiet.
            Maecenas id dolor quis lectus sodales rutrum. Nulla vitae tristique
            enim. Donec vel lacus eros. Pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas.
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default Policy;

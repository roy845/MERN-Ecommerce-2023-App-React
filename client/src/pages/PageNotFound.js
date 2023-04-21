import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f2f2f2;
`;

const NotFoundTitle = styled.h1`
  font-size: 8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const NotFoundMessage = styled.p`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #555;
`;

const NotFoundButton = styled(Link)`
  padding: 1rem 2rem;
  background-color: #008cba;
  color: #fff;
  font-size: 1.5rem;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #006e9f;
  }
`;

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundMessage>
        Oops ! We couldn't find the page you're looking for.
      </NotFoundMessage>
      <NotFoundButton onClick={() => navigate(-1)}>Go back</NotFoundButton>
    </NotFoundContainer>
  );
};

export default PageNotFound;

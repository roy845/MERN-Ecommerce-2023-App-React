import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
import { TextField } from "@material-ui/core";
import toast from "react-hot-toast";

const CONTACT_US_URL = "/api/v1/contact/contact-us";

const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f2f2f2;
  margin: 0 auto; // center the container horizontally
`;

const ContactTitle = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const ContactTextarea = styled.textarea`
  width: 100%;
  height: 10rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1.5rem;
`;

const ContactButton = styled.button`
  padding: 1rem 2rem;
  background-color: #008cba;
  color: #fff;
  font-size: 1.5rem;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #006e9f;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: gray;
  }

  &:active {
    background-color: #004f73;
  }
`;

const ContactLink = styled(Link)`
  padding: 1rem 2rem;
  background-color: #008cba;
  color: #fff;
  font-size: 1.5rem;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #006e9f;
  }
`;

const ContactPrompt = styled.p`
  margin-top: 10rem;
  font-size: 3rem;
  font-style: italic;
  color: #666;
  text-align: center; /* Add this to center the component */
  font-weight: bold; /* Add this to make the font bold */
`;

const ContactInfo = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ContactInfoTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const ContactInfoText = styled.p`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #666;
`;

const Contact = () => {
  const [isSent, setIsSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    const { email, name, phone } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
  }, [auth?.user]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      return;
    }
    try {
      const { data } = await axios.post(CONTACT_US_URL, {
        name,
        email,
        phone,
        message,
      });
      toast.success(data?.message);
      setIsSent(true);
    } catch (error) {
      console.log(error);
    }
  };

  const canSave = name && email && phone && message;

  return (
    <Layout title={"Contact us"}>
      {!isSent ? (
        <ContactContainer>
          <ContactTitle>Get in Touch</ContactTitle>
          <ContactForm>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              disabled
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
              id="phone"
              name="phone"
              autoComplete="phone"
              autoFocus
              value={phone}
              disabled
            />

            <TextField
              multiline
              variant="outlined"
              margin="normal"
              fullWidth
              id="message"
              name="message"
              autoComplete="message"
              autoFocus
              minRows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <ContactButton onClick={handleContactSubmit} disabled={!canSave}>
              Send Message
            </ContactButton>
          </ContactForm>

          <ContactInfo>
            <ContactInfoTitle>Contact Us</ContactInfoTitle>
            <ContactInfoText>Email: royatali94@gmail.com</ContactInfoText>
            <ContactInfoText>Phone: +972-54-4569435</ContactInfoText>
          </ContactInfo>
        </ContactContainer>
      ) : (
        <ContactContainer>
          <ContactPrompt>
            {" "}
            Thanks {name} We'll get back to you soon!
          </ContactPrompt>
          <ContactLink to="/">Go back home</ContactLink>
        </ContactContainer>
      )}
    </Layout>
  );
};

export default Contact;

import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const h1Ref = useRef(null);
  const now = new Date().getFullYear();

  return (
    <div className="footer">
      <h1 className="text-center">
        &copy; {now} Ecommerce App. All Right Reserved
      </h1>
      <p className="text-center mt-3">
        <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>|{" "}
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
  );
};

export default Footer;

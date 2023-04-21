import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "../components/Header";
import { Helmet } from "react-helmet";
import { useAuth } from "../context/auth";
import SplashScreen from "./SplashScreen";

const Layout = ({ children, title, description, keywords, author }) => {
  const { isLoading, setIsLoading } = useAuth(); // get the auth state from the context

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3500);
  }, []);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <div>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
        </div>
        <title>{title}</title>
      </Helmet>

      {isLoading ? (
        <>
          <SplashScreen />
        </>
      ) : (
        <>
          <Header />
          <main style={{ minHeight: "80vh" }}>{children}</main>
          <Footer />
        </>
      )}
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce app - shop now",
  description: "MERN stack project",
  keywords: "mern,react,node,mongodb",
  author: "roy atali",
};

export default Layout;

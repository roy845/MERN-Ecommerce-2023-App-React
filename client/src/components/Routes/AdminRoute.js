import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router";
import Spinner from "../Spinner";
import axios from "axios";

const AUTH_URL = "/api/v1/auth/admin-auth";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const { auth } = useAuth("");

  useEffect(() => {
    const authCheck = async () => {
      const response = await axios.get(
        `${AUTH_URL}`
      );

      if (response.data.ok) setOk(response.data.ok);
      else setOk(response.data.ok);
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}

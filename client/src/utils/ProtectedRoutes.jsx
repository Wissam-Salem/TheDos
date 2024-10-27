import { useContext } from "react";
import { ThemeContext } from "../Context/Context";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  let token = window.localStorage.getItem("cookieFallback");
  return token === null ? <Navigate to={"/"} /> : <Outlet />;
}

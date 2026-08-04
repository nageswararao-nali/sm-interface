import React from "react"
import { Navigate } from "react-router-dom"

// Authentication related pages
import Login from "../pages/Authentication/Login"
// import Logout from "../pages/Authentication/Logout"
// import Register from "../pages/Authentication/Register"
// import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
// import Bookings from "../pages/Bookings/Bookings"
import Bookings from "../pages/Dashboard/Bookings"
const userRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/bookings", component: Bookings },
  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Navigate to="/login" /> },
]

const authRoutes = [
  // { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  // { path: "/forgot-password", component: ForgetPwd },
  // { path: "/register", component: Register },
  
]

export { userRoutes, authRoutes }

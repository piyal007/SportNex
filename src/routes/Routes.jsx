import { createBrowserRouter } from "react-router-dom";
import Main from "@/layouts/Main";
import Error from "@/pages/error/Error";
import Home from "@/pages/home/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Courts from "@/pages/courts/Courts";

import PrivateRoute from "@/components/PrivateRoute";
import PublicRoute from "@/components/PublicRoute";
import { AdminRoute, MemberRoute } from "@/components/RoleBasedRoute";
import RoleBasedRedirect from "@/components/RoleBasedRedirect";
import AdminSetup from "@/components/AdminSetup";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/dashboard/Profile";
import PendingBookings from "@/pages/dashboard/PendingBookings";
import UserRoute from "@/components/UserRoute";


const router = createBrowserRouter([
    {
        path: "/",
        Component: Main,
        errorElement: <Error />, 
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "/login",
                element: <PublicRoute><Login /></PublicRoute>,
            },
            {
                path: "/register",
                element: <PublicRoute><Register /></PublicRoute>,
            },
            {
                path: "/courts",
                Component: Courts,
            },
            {
                path: "/admin-setup",
                element: <AdminSetup />,
            },
        ]
    },
    {
        path: "/dashboard",
        element: <UserRoute><Dashboard /></UserRoute>,
        errorElement: <Error />,
        children: [
          { index: true, element: <Profile /> },
          { path: "profile", element: <Profile /> },
          { path: "pending-bookings", element: <PendingBookings /> }
        ]
    },
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
import Main from "@/layouts/Main";
import Error from "@/pages/error/Error";
import Home from "@/pages/home/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Courts from "@/pages/courts/Courts";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/dashboard/Profile";
import PendingBookings from "@/pages/dashboard/PendingBookings";
import Announcements from "@/pages/dashboard/Announcements";
import PrivateRoute from "@/components/PrivateRoute";


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
                Component: Login,
            },
            {
                path: "/register",
                Component: Register,
            },
            {
                path: "/courts",
                Component: Courts,
            },
        ]
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        errorElement: <Error />,
        children: [
          { index: true, element: <Profile /> },
          { path: "profile", element: <Profile /> },
          { path: "pending-bookings", element: <PendingBookings /> },
          { path: "announcements", element: <Announcements /> },
        ]
    },
]);

export default router;
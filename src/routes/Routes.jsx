import { createBrowserRouter } from "react-router-dom";
import Main from "@/layouts/Main";
import Error from "@/pages/error/Error";
import Home from "@/pages/home/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Courts from "@/pages/courts/Courts";

import PrivateRoute from "@/components/PrivateRoute";
import PublicRoute from "@/components/PublicRoute";
import { AdminRoute, MemberRoute, UserRoute } from "@/components/RoleBasedRoute";
import RoleBasedRedirect from "@/components/RoleBasedRedirect";
import AdminSetup from "@/components/AdminSetup";


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
]);

export default router;
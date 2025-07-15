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
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import AdminDashboardHome from "@/pages/dashboard/AdminDashboardHome";
import Profile from "@/pages/dashboard/Profile";
import PendingBookings from "@/pages/dashboard/PendingBookings";
import ApprovedBookings from "@/pages/dashboard/ApprovedBookings";
import Announcements from "@/pages/dashboard/Announcements";
import ManageBookings from "@/pages/dashboard/ManageBookings";
import ManageMembers from "@/pages/dashboard/ManageMembers";
import AllUsers from "@/pages/dashboard/AllUsers";
import ManageCourts from "@/pages/dashboard/ManageCourts";
import UserRoute from "@/components/UserRoute";
import ManageCoupons from "@/pages/dashboard/ManageCoupons";
import Payment from "@/pages/dashboard/Payment";
import ConfirmedBookings from "@/pages/dashboard/ConfirmedBookings";
import PaymentHistory from "@/pages/dashboard/PaymentHistory";


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
          { path: "pending-bookings", element: <PendingBookings /> },
          { path: "approved-bookings", element: <ApprovedBookings /> },
          { path: "payment", element: <MemberRoute><Payment /></MemberRoute> },
          { path: "confirmed-bookings", element: <MemberRoute><ConfirmedBookings /></MemberRoute> },
          { path: "payment-history", element: <MemberRoute><PaymentHistory /></MemberRoute> },
          { path: "announcements", element: <Announcements /> }
        ]
    },
    {
        path: "/admin-dashboard",
        element: <AdminRoute><AdminDashboard /></AdminRoute>,
        errorElement: <Error />,
        children: [
          { index: true, element: <AdminDashboardHome /> },
          { path: "manage-bookings", element: <ManageBookings /> },
          { path: "manage-members", element: <ManageMembers /> },
          { path: "all-users", element: <AllUsers /> },
          { path: "manage-courts", element: <ManageCourts /> },
          { path: "manage-coupons", element: <ManageCoupons /> },
          { path: "announcements", element: <Announcements /> }
        ]
    },
]);

export default router;
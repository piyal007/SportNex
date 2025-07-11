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
import MemberDashboard from "@/pages/dashboard/MemberDashboard";
import MemberProfile from "@/pages/dashboard/member/MemberProfile";
import MemberPendingBookings from "@/pages/dashboard/member/PendingBookings";
import ApprovedBookings from "@/pages/dashboard/member/ApprovedBookings";
import ConfirmedBookings from "@/pages/dashboard/member/ConfirmedBookings";
import PaymentHistory from "@/pages/dashboard/member/PaymentHistory";
import MemberAnnouncements from "@/pages/dashboard/member/Announcements";

// Admin Dashboard Components
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import AdminProfile from "@/pages/dashboard/admin/AdminProfile";
import ManageBookings from "@/pages/dashboard/admin/ManageBookings";
import ManageMembers from "@/pages/dashboard/admin/ManageMembers";
import AllUsers from "@/pages/dashboard/admin/AllUsers";
import ManageCourts from "@/pages/dashboard/admin/ManageCourts";
import AdminConfirmedBookings from "@/pages/dashboard/admin/ConfirmedBookings";
import ManageCoupons from "@/pages/dashboard/admin/ManageCoupons";
import AdminAnnouncements from "@/pages/dashboard/admin/Announcements";

import PrivateRoute from "@/components/PrivateRoute";
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
            {
                path: "/redirect-dashboard",
                element: <RoleBasedRedirect />,
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
          { path: "announcements", element: <Announcements /> },
        ]
    },
    {
        path: "/member-dashboard",
        element: <MemberRoute><MemberDashboard /></MemberRoute>,
        errorElement: <Error />,
        children: [
          { index: true, element: <MemberProfile /> },
          { path: "profile", element: <MemberProfile /> },
          { path: "pending-bookings", element: <MemberPendingBookings /> },
          { path: "approved-bookings", element: <ApprovedBookings /> },
          { path: "confirmed-bookings", element: <ConfirmedBookings /> },
          { path: "payment-history", element: <PaymentHistory /> },
          { path: "announcements", element: <MemberAnnouncements /> },
        ]
    },
    {
        path: "/admin-dashboard",
        element: <AdminRoute><AdminDashboard /></AdminRoute>,
        errorElement: <Error />,
        children: [
          { index: true, element: <AdminProfile /> },
          { path: "profile", element: <AdminProfile /> },
          { path: "manage-bookings", element: <ManageBookings /> },
          { path: "manage-members", element: <ManageMembers /> },
          { path: "all-users", element: <AllUsers /> },
          { path: "manage-courts", element: <ManageCourts /> },
          { path: "confirmed-bookings", element: <AdminConfirmedBookings /> },
          { path: "manage-coupons", element: <ManageCoupons /> },
          { path: "announcements", element: <AdminAnnouncements /> },
        ]
    },
]);

export default router;
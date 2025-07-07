import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Error from "../pages/error/Error";
import Home from "../pages/home/Home";


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
        ]
    },
]);

export default router;
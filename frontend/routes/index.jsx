import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "about/", element: <About /> },
            { path: "login/", element: <Login /> },
            { path: "signup/", element: <Signup /> },
            // {path: "chatbot/", element: <Chatbot />},
            // {path: "profile/", element: <Profile />},
        ]
    }

]);

export default router;

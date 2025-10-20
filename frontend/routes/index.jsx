import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Chatbot from "../pages/Chatbot";
import DoctorProfile from "../pages/DoctorProfile";
import Patients from "../pages/Patients";
import PatientDetail from "../pages/PatientDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "about/", element: <About /> },
            { path: "login/", element: <Login /> },
            { path: "signup/", element: <Signup /> },
            { path: "chatbot/", element: <Chatbot /> },
            { path: "profile/", element: <DoctorProfile /> },
            { path: "patients/", element: <Patients /> },
            { path: "patients/:id/", element: <PatientDetail /> },
        ]
    }

]);

export default router;

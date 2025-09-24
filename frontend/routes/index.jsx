import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {index: true, element: <Home />},
            // {path: "signin/", element: <Signin />},
            // {path: "signup/", element: <Signup />},
            // {path: "profile/", element: <Profile />},

            // {path: "menu/", element: <Menu />},
            // {path: "menu/details/:id", element: <ProductDetail />},
            // {path: "cart/", element: <Cart />},
            // {path: "successPayment/", element: <Success />},
            // {path: "branch/", element: <Branch />},
            // {path: "careers/", element: <Recruit />},
            // {path: "successPayment/", element: <Success />},
            // {path: "about/", element: <About />},
            // {path: "contact/", element: <Contact />},
        ]
    }
    
]);

export default router;

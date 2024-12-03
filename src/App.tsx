import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Navbar from "./Components/Navbar";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/registration",
          element: <Registration />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

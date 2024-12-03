import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Registration />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

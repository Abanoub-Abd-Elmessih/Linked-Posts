import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import { Provider } from "react-redux";
import { store } from "./lib/store";
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./Pages/Profile";
import SinglePost from "./Pages/PostDetails";
import { Toaster } from "react-hot-toast";
import ChangePassword from "./Pages/ChangePassword";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <ProtectedRoute>
            <Home />
          </ProtectedRoute>,
        },
        {
          path:'/profile',
          element: <ProtectedRoute>
            <Profile />
          </ProtectedRoute>,
        },
        {
          path:'/PostDetails/:id',
          element: <ProtectedRoute>
            <SinglePost />
          </ProtectedRoute>,
        },
        {
          path:'/changePassword',
          element: <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>,
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
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  );
}

export default App;

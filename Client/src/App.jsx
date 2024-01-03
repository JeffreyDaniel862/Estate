import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/sign-in', element: <SignIn /> },
  { path: '/about', element: <About /> },
  { path: '/profile', element: <Profile /> },

])

export default function App() {
  return (<RouterProvider router={router} />)
}
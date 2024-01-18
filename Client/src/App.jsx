import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SignUp, { signupAction } from "./pages/SignUp";
import SignIn, { signinAction } from "./pages/SignIn";
import About from "./pages/About";
import Profile, { deleteAction, profileUpdateAction } from "./pages/Profile.jsx";
import RootLayout from "./pages/RootLayout";
import NewList from "./pages/NewList.jsx";
import { listAction } from "./components/ListForm.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sign-up', element: <SignUp />, action: signupAction },
      { path: 'sign-in', element: <SignIn />, action: signinAction },
      { path: 'about', element: <About /> },
      { path: 'profile', element: <Profile />, action: profileUpdateAction },
      { path: 'list', element: <NewList />, action: listAction },
      { path: 'delete', action: deleteAction }
    ]
  },
])

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SignUp, { signupAction } from "./pages/SignUp";
import SignIn, { signinAction } from "./pages/SignIn";
import About from "./pages/About";
import Profile, { deleteAction, profileUpdateAction } from "./pages/Profile.jsx";
import RootLayout from "./pages/RootLayout";
import NewList from "./pages/NewList.jsx";
import { listAction } from "./components/ListForm.jsx";
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./utils/http.js";
import EditList, { listLoader } from "./pages/EditList.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sign-up', element: <SignUp />, action: signupAction },
      { path: 'sign-in', element: <SignIn />, action: signinAction },
      { path: 'about', element: <About /> },
      {
        path: 'profile',
        children: [
          {index: true , element: <Profile />, action: profileUpdateAction},
          {path: 'create-list', element: <NewList />, action: listAction },
          {path: "edit-list/:id", element: <EditList />, loader: listLoader, action: listAction}
        ]
      },
      { path: 'delete', action: deleteAction }
    ]
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home, { getRentList } from "./pages/Home";
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
import List from "./pages/List.jsx";
import ErrorPage from "./pages/Error.jsx";
import Search from "./pages/Search.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home />, loader: getRentList },
      { path: 'sign-up', element: <SignUp />, action: signupAction },
      { path: 'sign-in', element: <SignIn />, action: signinAction },
      {
        path: 'profile',
        children: [
          {index: true , element: <Profile />, action: profileUpdateAction},
          {path: 'create-list', element: <NewList />, action: listAction },
          {path: "edit-list/:id", element: <EditList />, loader: listLoader, action: listAction}
        ]
      },
      {path: "/list/:id", element: <List />, loader: listLoader},
      {path: "/search", element: <Search />},
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
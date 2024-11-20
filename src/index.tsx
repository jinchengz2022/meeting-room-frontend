import React from "react";
import ReactDOM from "react-dom/client";
import { Login } from "./page/Login";
// import { Update } from "@/page/Update";
import { Register } from "./page/Register/index";
import { List } from "./page/List/index";
import { Home } from "./page/index";

import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MettingRoom } from "./page/MettingRoom";
import { BookingList } from "./page/List/BookingList";

const routes = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/admin/meeting-room",
        element: <MettingRoom />,
      },
      {
        path: "/admin/meeting-room/booking",
        element: <BookingList />,
      },
      {
        path: "/admin/list",
        element: <List />,
      },
      {
        path: "/user/meeting-room",
        element: <MettingRoom />,
      },
      {
        path: "/user/history",
        element: <BookingList />,
      },
      // {
      //   path: 'meeting-room',
      //   element: <MettingRoom/>,
      // },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/error",
    element: <div>is not admin</div>,
  },
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();

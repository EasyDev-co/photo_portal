import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { App } from "./components/App/App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from 'react-redux'
import store from "../src/store";
const router = createBrowserRouter(createRoutesFromElements(<Route path='*' element={<App />} />));
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

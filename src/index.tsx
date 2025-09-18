import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import LandingPage from "./components/LandingPage";
import Login from "./clientes/Login";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Simple routing based on URL parameters
const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get('page');

const AppComponent = () => {
  if (page === 'login') {
    return <Login />;
  }
  return <LandingPage />;
};

root.render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

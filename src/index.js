import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";
import socket from "socket.io-client";

const BASE_URL = process.env.REACT_APP_API_SERVER;
const root = ReactDOM.createRoot(document.getElementById("root"));
export const socketIO = socket(BASE_URL);

socketIO.on("connect_error", (error) => {
  console.log("socket error", error);
});

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);

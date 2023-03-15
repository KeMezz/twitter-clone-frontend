import socket from "socket.io-client";

const BASE_URL = process.env.REACT_APP_API_SERVER;
const token = localStorage.getItem("token")?.split(" ")[1] ?? "";

export const socketIO = socket(BASE_URL, {
  auth: { token },
});

socketIO.on("connect_error", (error) => {
  console.log("socket error", error);
});

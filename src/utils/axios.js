import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_SERVER;

if (localStorage.getItem("token")) {
  axios.defaults.headers["Authorization"] = localStorage.getItem("token");
}

export const callAPI = axios.create({
  headers: { "Content-type": "application/json; charset=UTF-8" },
  timeout: 30000,
  timeoutErrorMessage: "서버와 통신할 수 없습니다.",
});

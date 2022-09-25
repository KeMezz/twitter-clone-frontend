import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_SERVER;

export const callAPI = axios.create({
  headers: { "Content-type": "application/json; charset=UTF-8" },
  timeout: 1000,
  timeoutErrorMessage: "서버와 통신할 수 없습니다.",
});

import axios from "axios";

export const API = axios.create({
  baseURL: "https://api.alhaeru.com/todos/v1/",
});



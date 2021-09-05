import axios from "axios";

const baseDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://gomoku.vanata.dev";

const baseURL = `${baseDomain}/api`;

export default axios.create({
  baseURL,
  headers: {
    Authorization: "JWT_TOKEN",
    "Content-Type": "application/json",
  },
});

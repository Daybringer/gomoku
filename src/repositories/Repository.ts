import axios from "axios";

const baseDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://playgomoku.com";

const baseURL = `${baseDomain}/api`;
console.log(baseURL);
export default axios.create({
  baseURL,
});

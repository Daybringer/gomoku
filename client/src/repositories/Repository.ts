import axios from "axios";

const baseDomain = !import.meta.env.PROD
  ? "http://localhost:3000"
  : "https://gomokugame.com";

const baseURL = `${baseDomain}/api`;

export default axios.create({
  baseURL,
  headers: {
    Authorization: "JWT_TOKEN",
    "Content-Type": "application/json",
  },
});

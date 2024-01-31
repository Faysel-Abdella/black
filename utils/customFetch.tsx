import axios from "axios";
const customFetch = axios.create({
  baseURL: "http://3.36.125.85:3000/",
});

export default customFetch;

import axios from "axios";
import { environment } from "../environments/environment.prod";
let token = localStorage.getItem("token");

export default {
  getAll: async (y, m) => {
    if (!token) {
      token = await getToken();
    }
    let res = await axios.get(`${environment.api}api/doodle/${y}/${m}`, {
      headers: {
        "x-access-token": token
      }
    });
    return res.data || [];
  }
};
const getToken = async () => {
  let res = await axios.get(`${environment.api}api/auth`);
  localStorage.setItem("token", res.data);
  return res.data;
};

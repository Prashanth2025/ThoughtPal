import axios from "axios";
import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUserDetails(setUser) {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${API_URL}/api/v1/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(res.data.user);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
}

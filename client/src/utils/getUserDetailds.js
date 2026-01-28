import axios from "axios";
import { toast } from "react-hot-toast";

export async function getUserDetails(setUser) {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`http://localhost:2000/api/v1/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(res.data.user);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
}

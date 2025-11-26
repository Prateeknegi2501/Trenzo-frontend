import axios from "axios";
import API_URLS from "./apiUrl";

export const authServices = {
  registerUser: async (formData) => {
    const response = await axios.post(API_URLS.AUTH.REGISTER, formData, {
      withCredential: true,
    });
    return response.data;
  },

  loginUser: async (formData) => {
    const response = await axios.post(API_URLS.AUTH.LOGIN, formData, {
      withCredentials: true,
    });
    return response.data;
  },
};

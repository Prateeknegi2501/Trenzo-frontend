import axios from "axios";
import API_URLS from "./apiUrl";

export const commonServices = {
  getFeatureImages: async () => {
    const response = await axios.get(API_URLS.COMMON.GET_FEATURED_IMAGE);
    return response.data;
  },
  addFeatureImages: async (image) => {
    const response = await axios.get(API_URLS.COMMON.ADD_FEATURED_IMAGE, {
      image,
    });
    return response.data;
  },
};

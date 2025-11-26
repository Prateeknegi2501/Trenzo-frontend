// src/services/adminServices.js
import api from "./Api";
import API_URLS from "./apiUrl";

const adminServices = {
  // --------- Admin Orders ---------
  getAllOrders: async () => {
    const response = await api.get(API_URLS.ADMIN.GET_ALL_ORDERS);
    return response.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await api.get(API_URLS.ADMIN.GET_ORDER_DETAILS(orderId));
    return response.data;
  },

  updateOrderStatus: async (orderId, orderStatus) => {
    const response = await api.put(
      API_URLS.ADMIN.UPDATE_ORDER_STATUS(orderId),
      {
        orderStatus,
      }
    );
    return response.data;
  },

  // --------- Admin Products ---------
  addProduct: async (formData) => {
    const response = await api.post(API_URLS.ADMIN.ADD_PRODUCT, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  fetchAllProducts: async () => {
    const response = await api.get(API_URLS.ADMIN.FETCH_PRODUCTS);
    return response.data;
  },

  editProduct: async (id, formData) => {
    const response = await api.put(API_URLS.ADMIN.EDIT_PRODUCT(id), formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(API_URLS.ADMIN.DELETE_PRODUCT(id));
    return response.data;
  },
};

export default adminServices;

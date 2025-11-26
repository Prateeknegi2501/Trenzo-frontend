import axios from "axios";
import API_URLS from "./apiUrl";

export const shoppingServices = {
  // --------- Addresses ---------
  addAddress: async (formData) => {
    const response = await axios.post(API_URLS.SHOP.ADD_ADDRESS, formData);
    return response.data;
  },

  fetchAllAddresses: async (userId) => {
    const response = await axios.get(API_URLS.SHOP.FETCH_ALL_ADDRESSES(userId));
    return response.data;
  },

  editAddress: async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      API_URLS.SHOP.EDIT_ADDRESS(userId, addressId),
      formData
    );
    return response.data;
  },

  deleteAddress: async ({ userId, addressId }) => {
    const response = await axios.delete(
      API_URLS.SHOP.DELETE_ADDRESS(userId, addressId)
    );
    return response.data;
  },

  // --------- Cart ---------
  addToCart: async ({ userId, productId, quantity }) => {
    const response = await axios.post(API_URLS.SHOP.ADD_CART, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  },

  fetchCartItems: async (userId) => {
    const response = await axios.get(API_URLS.SHOP.FETCH_CART(userId));
    return response.data;
  },

  deleteCartItem: async ({ userId, productId }) => {
    const response = await axios.delete(
      API_URLS.SHOP.DELETE_CART(userId, productId)
    );
    return response.data;
  },

  updateCart: async ({ userId, productId, quantity }) => {
    const response = await axios.put(API_URLS.SHOP.UPDATE_CART, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await axios.post(API_URLS.SHOP.CREATE_ORDER, orderData);
    return response.data;
  },

  capturePayment: async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(API_URLS.SHOP.CAPTURE_PAYMENT, {
      paymentId,
      payerId,
      orderId,
    });
    return response.data;
  },

  getOrdersByUser: async (userId) => {
    const response = await axios.get(API_URLS.SHOP.GET_ORDERS_BY_USER(userId));
    return response.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await axios.get(API_URLS.SHOP.GET_ORDER_DETAILS(orderId));
    return response.data;
  },
  fetchAllProducts: async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const response = await axios.get(
      `${API_URLS.SHOP.GET_ALL_PRODUCTS}?${query}`
    );
    return response.data;
  },

  fetchProductDetails: async (id) => {
    const response = await axios.get(API_URLS.SHOP.GET_PRODUCT_DETAILS(id));
    return response.data;
  },
  addReview: async (formData) => {
    const response = await axios.post(API_URLS.SHOP.ADD_REVIEW, formData);
    return response.data;
  },

  getReviews: async (productId) => {
    const response = await axios.get(API_URLS.SHOP.GET_REVIEWS(productId));
    return response.data;
  },
  getSearchResults: async (keyword) => {
    const response = await axios.get(API_URLS.SHOP.SEARCH(keyword));
    return response.data;
  },
};

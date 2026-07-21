import axios from 'axios';
import { Url } from './CategoriesServer';

const StockServise = {

  getAllPaloxAndAllProductAndCOLD_ROOMS: async () => {
    try {
      const response = await axios.get(`${Url}/stock/getAllPaloxAndAllProductAndCOLD_ROOMS`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

  AjoutPalox: async (payload, userId, roomname) => {
    try {
      const data = { ...payload, userId, roomname };
      const response = await axios.post(`${Url}/stock/AjoutPalox`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

  MovePalox: async (paloxId, targetRoomId, targetLocation, userId, roomname) => {
    try {
      const response = await axios.post(`${Url}/stock/MovePalox`, {
        paloxId, targetRoomId, targetLocation, userId, roomname
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

  UpdatePaloxStatus: async (paloxId, status) => {
    try {
      const response = await axios.post(`${Url}/stock/UpdatePaloxStatus`, {
        paloxId, status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

  SortiePalox: async (payload) => {
    try {
      const response = await axios.post(`${Url}/stock/SortiePalox`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  }

};

export default StockServise;
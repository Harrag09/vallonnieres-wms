
import axios from 'axios';

import { Url } from './CategoriesServer';

const StockServise= {


     getAllPaloxAndAllProductAndCOLD_ROOMS: async (login, password) => {
        try {
          const response = await axios.get(`${Url}/stock/getAllPaloxAndAllProductAndCOLD_ROOMS`);
     
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      },
     


  };

export default StockServise;

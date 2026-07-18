// Client-side (AuthService.js)
import axios from 'axios';

import { Url } from './CategoriesServer';

const AuthService= {
  
    signIn: async (login, password) => {
        try {
                    console.log("wess",login,password);

          const response = await axios.post(`${Url}/auth/signin`, { Login: login, Password: password });
          console.log("wess",response);
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      }

  



  };

export default AuthService;

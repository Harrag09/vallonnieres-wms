import axios from "axios";
import { Url } from './CategoriesServer';

const UserService2 = {
    getAllUsers: async () => {
        const res = await axios.get(`${Url}/users/getAllUsers`);
        return res.data;
    },
    createUser: async (data) => {
        const res = await axios.post(`${Url}/users/createUser`, data);
        return res.data;
    },
    updateUser: async (id, data) => {
        // Correction : Utilisation de PUT et passage de l'ID dans l'URL
        const res = await axios.put(`${Url}/users/updateUser/${id}`, data);
        return res.data;
    },
    deleteUser: async (id) => {
        // Correction : Utilisation de la route correcte /deleteUser/:id
        const res = await axios.delete(`${Url}/users/deleteUser/${id}`);
        return res.data;
    },
    loginUser: async (credentials) => {
        const res = await axios.post(`${Url}/users/login`, credentials);
        return res.data;
    }
};

export default UserService2;
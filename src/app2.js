import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie library for cookie management
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AdminLayout from "layouts/Admin.js";
import FirstPage from "views/FirstPage/FirstPage";
import { jwtDecode } from "jwt-decode";
import socketIOClient, { io } from 'socket.io-client';
import { Url } from "Service/CategoriesServer";
import Profil from "views/Profil";
export const socket = socketIOClient(Url);



const App = () => {

  // State to track the authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decoded, setdecoded] = useState("");
  const [idStore, setIdidStore] = useState("");
  const [idcrm, setidcrm] = useState("");
  const [Name, setName] = useState("Dashbord");

useEffect(() => {

  socket.on('connect', () => {
    console.log('Connected to server',socket);

    
   
  });

}, [socket]);


  useEffect(() => {
    // Check if the login cookie exists
    const loginCookie = Cookies.get("isLoggedIn");
    if (loginCookie === "isLoggedIn") {
      setIsLoggedIn(true);
      const accessToken = Cookies.get("access_token");
      const nm = Cookies.get("Name");
      const crm = Cookies.get("idCRM");
      setName(nm);
      setidcrm(crm);
      const decoded = jwtDecode(accessToken);
      setdecoded(decoded.Role);
      setIdidStore(decoded.id)
      
    } else {
      setIsLoggedIn(false);
    }
  
  }, []);

  const getDefaultRoute = (decoded) => {
    if (decoded === "store") {
     // console.log("2222",idcrm);
         return   <Route path="/" element={<Navigate to={`/admin/${Name}`} replace state={{ _id: idStore,idCRM:idcrm }} />} />

    } else if (decoded === "admin") {
      return   <Route path="/" element={<Navigate to="/admin/users" replace />} />
    }
    
  };
  return (
    <>
      {isLoggedIn ? (
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminLayout />} />
            {getDefaultRoute(decoded)}
            {/* <Route path="/" element={<Navigate to={`/admin/profil`} replace state={{ _id: idStore,idCRM:idcrm }} />} /> */}
          </Routes>
        </BrowserRouter>
      ) : (
        <FirstPage />
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AdminLayout from "layouts/Admin.js";
import FirstPage from "views/FirstPage/FirstPage";
import { jwtDecode } from "jwt-decode";
// import socketIOClient from 'socket.io-client';
import { Url } from "Service/CategoriesServer";

// export const socket = socketIOClient(Url);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decoded, setdecoded] = useState("");
  const [idStore, setIdidStore] = useState("");
  const [idcrm, setidcrm] = useState("");
  const [Name, setName] = useState("Dashbord");

  useEffect(() => {
    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`)
          .then(reg => console.log('PWA Service Worker registered:', reg))
          .catch(err => console.log('SW registration failed:', err));
      });
    }
  }, []);

  useEffect(() => {
    const loginCookie = Cookies.get("isLoggedIn");
    if (loginCookie === "isLoggedIn") {
      setIsLoggedIn(true);
      const accessToken = Cookies.get("access_token");
      setName(Cookies.get("Name"));
      setidcrm(Cookies.get("idCRM"));
      const dec = jwtDecode(accessToken);
      setdecoded(dec.Role);
      setIdidStore(dec.id);
    }
  }, []);

  const getDefaultRoute = (role) => {
    if (role === "store") {
      return <Route path="/" element={<Navigate to={`/admin/${Name}`} replace state={{ _id: idStore, idCRM: idcrm }} />} />;
    } else if (role === "admin") {
      return <Route path="/" element={<Navigate to="/admin/stock" replace />} />;
    }
  };

  return (
    <HashRouter>
      {isLoggedIn ? (
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          {getDefaultRoute(decoded)}
        </Routes>
      ) : (
        <FirstPage />
      )}
    </HashRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
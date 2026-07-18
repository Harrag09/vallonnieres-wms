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
import socketIOClient from 'socket.io-client';
import { Url } from "Service/CategoriesServer";

export const socket = socketIOClient(Url);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decoded, setdecoded] = useState("");
  const [idStore, setIdidStore] = useState("");
  const [idcrm, setidcrm] = useState("");
  const [Name, setName] = useState("Dashbord");
  
  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // 1. PWA: Listen for install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // 2. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .catch(err => console.log('SW registration failed:', err));
    }

    socket.on('connect', () => console.log('Connected to server', socket));
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

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
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getDefaultRoute = (decoded) => {
    if (decoded === "store") {
      return <Route path="/" element={<Navigate to={`/admin/${Name}`} replace state={{ _id: idStore, idCRM: idcrm }} />} />;
    } else if (decoded === "admin") {
      return <Route path="/" element={<Navigate to="/admin/users" replace />} />;
    }
  };

  return (
    <>
      {/* PWA Install Prompt Banner */}
      {deferredPrompt && (
        <div style={{ padding: '10px', background: '#f8f9fa', borderBottom: '1px solid #ccc', textAlign: 'center', zIndex: 9999 }}>
          <span>Download our app for better navigation!</span>
          <button onClick={handleInstallClick} style={{ marginLeft: '15px', padding: '5px 15px', cursor: 'pointer' }}>
            Download
          </button>
        </div>
      )}

      {isLoggedIn ? (
        // Use HashRouter for GitHub Pages deployment
        <HashRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminLayout />} />
            {getDefaultRoute(decoded)}
          </Routes>
        </HashRouter>
      ) : (
        <FirstPage />
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
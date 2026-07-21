
import Dashboard from "views/Dashboard.js";
import ScreenHome from "views/ScreenHome";
import Logout from "views/Logout";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
import Profil from "views/Profil";
import Stock from "views/Stock/Stock";
const token = Cookies.get("access_token");
const decoded = token ? jwtDecode(token) : "";
 const nm = Cookies.get("Name");
const Name = nm ? nm : "Dashbord";
const Setting = Cookies.get("Setting");
console.log()


var routes = [
 
];


   routes.push(
  {
    path: "/stock",
    name: "stock",
    icon: "nc-icon nc-bank",
    component: <Stock/>,
    layout: "/admin",
  },);
if (decoded.Role=== "admin") {
  routes.push(
    
    {
    path: "/users",
    name: "users",
    icon: "nc-icon nc-bank",
    component: <ScreenHome/>,
    layout: "/admin",
  },
  {
    path: `/Dashboard`,
    name: "Salim",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
    {
    path: "/logout",
    name: "Déconnecter",
    icon: "nc-icon nc-button-power",
    component: <Logout/>,
    layout: "/admin",
  });

}
if (decoded.Role=== "store" && (Setting=== "true" )) {
  routes.push(
    {
      path: `/${Name}`,
      name: "Statistique",
      icon: "nc-icon nc-bank",
      component: <Dashboard />,
      layout: "/admin",
    }, {
      path: `/Profil`,
      name: "settings",
      icon: "nc-icon nc-settings-gear-65",
      component: <Profil />,
      layout: "/admin",
    },
    {
    path: "/logout",
    name: "Déconnecter",
    icon: "nc-icon nc-button-power",
    component: <Logout/>,
    layout: "/admin",
  });
}else if (decoded.Role=== "store"&& (Setting=== "false" )){
  routes.push(
    {
      path: `/${Name}`,
      name: "Statistique",
      icon: "nc-icon nc-bank",
      component: <Dashboard />,
      layout: "/admin",
    },
    {
    path: "/logout",
    name: "Déconnecter",
    icon: "nc-icon nc-button-power",
    component: <Logout/>,
    layout: "/admin",
  });
}
export default routes;

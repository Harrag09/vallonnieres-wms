
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// import styled from 'styled-components';
import maksebLogo from "maksebLogo.png";

var ps;

function Sidebar(props) {
  const location = useLocation();
  const sidebar = React.useRef();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <a
       
          className="simple-text logo-mini"
        >
          <div className="logo-img">
          <img src={maksebLogo} alt="react-logo" style={{ backgroundColor: "#f4f3ef",width:"300px",Height:"300px" }} />
          </div>
        </a>
        <a
          
          className="simple-text logo-normal"
        >
       Vergers des Vallonières  </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
        {props.routes.map((prop, key) => {
  // Define a variable to hold the style object
  let liStyle = {};

  // Check if prop.name is "abc", then set marginTop to 40px
  if (prop.name === "Déconnecter") {
    liStyle = { marginTop: "120%" };
  }

  if (prop.name !== "Salim") {
    return (
      <li
        className={
          activeRoute(prop.path) + (prop.pro ? " active-pro" : "")
        }
        key={key}
        style={liStyle} 
      >
        <NavLink to={prop.layout + prop.path} className="nav-NavLink" style={liStyle}>
          <i className={prop.icon} />
         <strong><p>{prop.name}</p></strong> 
        </NavLink>
      </li>
    );
  } else {
    return null; 
  }
})}

        </Nav>
  
      </div>
    
    </div>
  );
}

export default Sidebar;

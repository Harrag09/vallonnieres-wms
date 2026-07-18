import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaBars, FaTimes, FaSignInAlt, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import maksebLogo from "../../../vergers.jpg"; // Placeholder
import AboutUsScreen from "./AboutUsScreen";
import ContactScreen from "./ContactScreen";
import LoginScreen from "./LoginScreen";

// ===== DESIGN SYSTEM VARIABLES =====
const Colors = {
  PRIMARY: "#29335C",
  SECONDARY: "#F5A700",
  BACKGROUND: "#F7F9FC",
  TEXT_DARK: "#333333",
  TEXT_LIGHT: "#FFFFFF",
  BORDER: "#EBEFF3",
  HOVER_BG: "#EAECEF",
};

// ===== Animations =====
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

// ===== Styled Components =====
const Header = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ scrolled }) => (scrolled ? "10px 5vw" : "15px 5vw")};
  box-shadow: ${({ scrolled }) => (scrolled ? "0 4px 15px rgba(0,0,0,0.08)" : "0 2px 10px rgba(0,0,0,0.04)")};
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1000;
  border-bottom: 1px solid ${Colors.BORDER};

  @media (max-width: 992px) {
    padding: ${({ scrolled }) => (scrolled ? "10px 4vw" : "15px 4vw")};
  }
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;

  img {
    width: ${({ scrolled }) => (scrolled ? "40px" : "50px")};
    height: ${({ scrolled }) => (scrolled ? "40px" : "50px")};
    border-radius: 6px;
    object-fit: cover;
    transition: all 0.3s ease-in-out;
  }

  h4 {
    margin-left: 15px;
    font-size: ${({ scrolled }) => (scrolled ? "1.0rem" : "1.25rem")};
    font-weight: 700;
    color: ${Colors.PRIMARY};
    letter-spacing: -0.5px;
    transition: all 0.3s ease-in-out;
    line-height: 1.2;
    font-family: 'Montserrat', sans-serif;
  }
`;

const NavLinkStyle = css`
  display: flex;
  align-items: center;
  margin: 0 15px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${Colors.TEXT_DARK};
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    color: ${Colors.PRIMARY};
    background-color: ${Colors.HOVER_BG};
  }

  &.active {
    color: ${Colors.PRIMARY};
    font-weight: 700;
    
    &::after {
      content: "";
      position: absolute;
      bottom: -5px; 
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
      height: 3px;
      background-color: ${Colors.SECONDARY};
      border-radius: 2px;
      animation: ${fadeIn} 0.3s ease;
    }
  }

  svg {
    margin-right: 8px;
  }

  @media (max-width: 992px) {
    margin: 0;
    justify-content: flex-start;
    width: 100%;
    padding: 15px 25px;
    font-size: 1.1rem;

    &.active::after {
      content: none;
    }
    
    &.active {
      background-color: ${Colors.HOVER_BG};
      border-left: 5px solid ${Colors.SECONDARY};
      padding-left: 20px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  a {
    ${NavLinkStyle}
  }

  @media (max-width: 992px) {
    position: fixed;
    top: 0;
    right: ${({ open }) => (open ? "0" : "-100%")};
    height: 100vh;
    width: min(300px, 80vw);
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 80px;
    background: ${Colors.TEXT_LIGHT};
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
    transition: right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 999;
    gap: 5px;
    animation: ${slideIn} 0.4s ease;
  }
`;

const NavButton = styled.button`
  display: none; // Hidden by default
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: ${Colors.PRIMARY};
  transition: color 0.3s ease;

  &:hover {
    color: ${Colors.SECONDARY};
  }

  @media (max-width: 992px) {
    display: ${({ open }) => (open ? "none" : "block")};
    z-index: 1001;
  }
`;

const CloseButton = styled(NavButton)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  display: block;

  @media (min-width: 992px) {
    display: none; // Hide X on desktop
  }
`;

const Overlay = styled.div`
  display: ${({ open }) => (open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  z-index: 998;

  @media (min-width: 992px) {
    display: none;
  }
`;

const MainContent = styled.main`
  min-height: calc(100vh - 70px);
  background-color: ${Colors.BACKGROUND};
  animation: ${fadeIn} 0.6s ease;
`;

// ===== Helper Functions =====
const getActiveTab = () => {
  const hash = window.location.hash.substring(1);
  if (hash === "aboutus") return "aboutus";
  if (hash === "contact") return "contact";
    if (hash === "login") return "login";

  return "login";
};

const routes = {
  login: { component: LoginScreen, icon: FaSignInAlt, label: "Login" },
  aboutus: { component: AboutUsScreen, icon: FaInfoCircle, label: "About Us" },
  contact: { component: ContactScreen, icon: FaEnvelope, label: "Contact" },
};

// ===== Navbar Component =====
const Navbar = () => {
  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setActiveTab(getActiveTab());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (tab) => {
    window.location.hash = `#${tab}`;
    setActiveTab(tab);
    setNavOpen(false);
  };

  const CurrentComponent = routes[activeTab]?.component || AboutUsScreen;

  return (
    <>
      <Header scrolled={scrolled}>
        <LogoContainer href="#aboutus" scrolled={scrolled} onClick={() => handleTabChange("aboutus")}>
          <img src={maksebLogo} alt="Vergers des Vallonières Logo" />
          <h4>Vergers des Vallonières</h4>
        </LogoContainer>

        <Nav open={navOpen}>
          <CloseButton onClick={() => setNavOpen(false)}>
            <FaTimes />
          </CloseButton>
          
          {Object.entries(routes).map(([key, route]) => (
            <a
              key={key}
              href={`#${key}`}
              className={activeTab === key ? "active" : ""}
              onClick={() => handleTabChange(key)}
            >
              <route.icon />
              {route.label}
            </a>
          ))}
        </Nav>

        <NavButton onClick={() => setNavOpen(true)} open={navOpen}>
          <FaBars />
        </NavButton>
      </Header>

      <Overlay open={navOpen} onClick={() => setNavOpen(false)} />

      <MainContent>
        <CurrentComponent />
      </MainContent>
    </>
  );
};

export default Navbar;

import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import NotificationAlert from "react-notification-alert";
import AuthService from "Service/Auth";
import Cookies from "js-cookie";
import ReactLoading from "react-loading";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";

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
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ===== Styled Components =====
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  min-height: 80vh; 
  background-color: ${Colors.BACKGROUND};
`;

const Card = styled.div`
  background: ${Colors.TEXT_LIGHT};
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(41, 51, 92, 0.1); 
  max-width: 420px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease forwards;
  border: 1px solid ${Colors.BORDER};

  h2 {
    text-align: center;
    margin-bottom: 40px;
    color: ${Colors.PRIMARY};
    font-weight: 800;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
        margin-right: 12px;
        color: ${Colors.SECONDARY};
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600; 
  color: ${Colors.TEXT_DARK};
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px; 
  border: 1px solid ${Colors.BORDER};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: ${Colors.BACKGROUND};

  &:focus {
    border-color: ${Colors.SECONDARY};
    box-shadow: 0 0 0 3px rgba(245, 167, 0, 0.25); 
    background-color: ${Colors.TEXT_LIGHT};
    outline: none;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  top: 60%;
  left: 15px;
  transform: translateY(-50%);
  color: #999;
  font-size: 1.1rem;
  pointer-events: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px 20px;
  background-color: ${Colors.PRIMARY};
  color: ${Colors.TEXT_LIGHT};
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 25px;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #3f4a7c; 
    box-shadow: 0 5px 15px rgba(41, 51, 92, 0.3);
  }

  &:disabled {
    background-color: ${Colors.BORDER};
    color: #999;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const LoadingWrapper = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginScreen = () => {
  const notificationAlert = useRef(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showNotification = (message, type) => {
    const options = { place: "tr", message: <div>{message}</div>, type, autoDismiss: 3 };
    notificationAlert.current?.notificationAlert(options);
  };

  // ===== Login handler onClick =====
  const handleLogin = async () => {
    if (!login) return showNotification("Please enter your Login.", "danger");
    if (!password) return showNotification("Please enter your password.", "danger");

    try {
      setLoading(true);
      const response = await AuthService.signIn(login, password);
      setLoading(false);

      if (!response.success) {
        showNotification("Incorrect Login or password.", "danger");
      } else {
        showNotification("Login successful!", "success");
        Cookies.set("access_token", response.data.access_token, { expires: 7 });
        Cookies.set("isLoggedIn", "isLoggedIn", { expires: 7 });
        Cookies.set("idCRM", response.data.idCRM, { expires: 7 });
        Cookies.set("Name", response.data.Nom, { expires: 7 });
        Cookies.set("Setting", response.data.Setting, { expires: 7 });
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error", error);
      showNotification("An error occurred. Please try again.", "danger");
    }
  };

  return (
    <Container id="login">
      <Card>
        <h2><FaUserShield />Admin Panel</h2>
        <FormGroup>
          <Label htmlFor="Login">Login</Label>
          <InputIcon><FaEnvelope /></InputIcon>
          <Input
            id="Login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="vergers"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <InputIcon><FaLock /></InputIcon>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </FormGroup>
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? <LoadingWrapper>
            <ReactLoading type="spin" color={Colors.TEXT_LIGHT} height={25} width={25} />
          </LoadingWrapper> : "Secure Login"}
        </Button>
      </Card>
      <NotificationAlert ref={notificationAlert} />
    </Container>
  );
};

export default LoginScreen;

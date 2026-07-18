import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import NotificationAlert from 'react-notification-alert';
import { FaPaperPlane, FaUser, FaEnvelope, FaMobileAlt, FaCommentDots } from 'react-icons/fa';

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

// ===== Styled Components =====
const ContactWrapper = styled.div`
    min-height: 80vh;
    background-color: ${Colors.BACKGROUND};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
`;

const ContactCard = styled.div`
    width: 90%;
    max-width: 800px; /* Wider card for a better PC look */
    padding: 50px;
    background: ${Colors.TEXT_LIGHT};
    border-radius: 16px;
    box-shadow: 0 18px 40px rgba(41, 51, 92, 0.1);
    border: 1px solid ${Colors.BORDER};

    @media (max-width: 768px) {
        padding: 30px;
    }
`;

const ContactForm = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 40px;
    color: ${Colors.PRIMARY};
    font-weight: 800;
    font-size: 2.2rem;
    grid-column: 1 / -1; /* Make title span all columns */
`;

const FullWidthGroup = styled.div`
    grid-column: 1 / -1; /* Make textarea and button span all columns */
`;

const FormGroup = styled.div`
    position: relative;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${Colors.TEXT_DARK};
    font-size: 0.95rem;
    
    svg {
        margin-right: 8px;
        color: ${Colors.SECONDARY};
    }
`;

const InputBase = `
    width: 100%;
    padding: 15px 15px 15px 45px;
    border: 1px solid ${Colors.BORDER};
    border-radius: 10px;
    font-size: 1rem;
    background-color: ${Colors.BACKGROUND};
    transition: all 0.3s ease;
    
    &:focus {
        border-color: ${Colors.SECONDARY};
        box-shadow: 0 0 0 3px rgba(245, 167, 0, 0.25); 
        background-color: ${Colors.TEXT_LIGHT};
        outline: none;
    }
`;

const Input = styled.input`
    ${InputBase}
`;

const Textarea = styled.textarea`
    ${InputBase}
    resize: vertical;
    min-height: 160px;
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
    padding: 16px 30px;
    background-color: ${Colors.PRIMARY};
    color: ${Colors.TEXT_LIGHT};
    font-size: 1.1rem;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 15px;
    letter-spacing: 0.5px;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;

    &:hover {
        background-color: #3f4a7c;
        box-shadow: 0 5px 15px rgba(41, 51, 92, 0.3);
    }
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
        margin-left: 10px;
        font-size: 1.1rem;
    }
`;

// ===== Component =====
const ContactScreen = () => {
    const notificationAlert = useRef(null);
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');

    const showNotification = (message, type) => {
        const options = {
            place: 'tr',
            message: <div>{message}</div>,
            type: type,
            autoDismiss: 3,
        };
        if (notificationAlert.current) {
             notificationAlert.current.notificationAlert(options);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate success and reset
        setEmail('');
        setMobile('');
        setMessage('');
        setName('');
        showNotification('Votre demande a été envoyée. Nous vous recontacterons rapidement.', 'success');
    };

    return (
        <ContactWrapper id="contact">
            <ContactCard>
                <form onSubmit={handleSubmit}>
                    <Title>Parlez-nous de Votre Projet</Title>

                    <ContactForm>
                        <FormGroup>
                            <Label htmlFor="name"><FaUser />Nom Complet :</Label>
                            <InputIcon><FaUser /></InputIcon>
                            <Input 
                                id="name"
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                placeholder="Jean Dupont / SARL Construction"
                            />
                        </FormGroup>      
                        <FormGroup>
                            <Label htmlFor="mobile"><FaMobileAlt />Téléphone:</Label>
                            <InputIcon><FaMobileAlt /></InputIcon>
                            <Input 
                                id="mobile"
                                type="tel" 
                                value={mobile} 
                                onChange={(e) => setMobile(e.target.value)} 
                                required 
                                placeholder="+33 6 00 00 00 00"
                            />
                        </FormGroup>
                        <FullWidthGroup>
                             <FormGroup>
                                <Label htmlFor="email"><FaEnvelope />Email:</Label>
                                <InputIcon><FaEnvelope /></InputIcon>
                                <Input 
                                    id="email"
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    placeholder="exemple@domaine.com"
                                />
                            </FormGroup>
                        </FullWidthGroup>
                        <FullWidthGroup>
                            <FormGroup>
                                <Label htmlFor="message"><FaCommentDots />Détails du Projet:</Label>
                                <Textarea 
                                    id="message"
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    required 
                                    placeholder="Décrivez vos besoins, les matériaux recherchés, et le contexte du projet."
                                />
                            </FormGroup>
                        </FullWidthGroup>
                        <FullWidthGroup style={{ textAlign: 'center' }}>
                            <Button type="submit">
                                Envoyer la Demande <FaPaperPlane />
                            </Button>
                        </FullWidthGroup>
                    </ContactForm>
                </form>
            </ContactCard>
            <NotificationAlert ref={notificationAlert} />
        </ContactWrapper>
    );
};

export default ContactScreen;
import React from "react";
import styled from "styled-components";
import { FaSeedling, FaHandsHelping, FaCogs, FaMapMarkerAlt, FaPhoneAlt, FaEnvelopeOpenText } from 'react-icons/fa';

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
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  color: ${Colors.TEXT_DARK};
  background: ${Colors.BACKGROUND}; 
  padding: 40px 0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1300px;
  padding: 0 3vw; 
`;

const HeroSection = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 100px;
  padding: 100px 5vw;
  border-radius: 20px;
  background: linear-gradient(
      rgba(255, 255, 255, 0.95), 
      rgba(255, 255, 255, 0.95)
    ),
    url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80')
      center/cover no-repeat;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid ${Colors.BORDER};

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  color: ${Colors.PRIMARY};
  margin-bottom: 25px;
  letter-spacing: -1.5px;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const SubTitle = styled.h2`
  font-size: 1.4rem;
  color: #555;
  line-height: 1.8;
  max-width: 900px;
  margin: 0 auto;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
`;

const Card = styled.div`
  background: ${Colors.TEXT_LIGHT};
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid ${Colors.BORDER};
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
  min-height: 280px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
    font-size: 3rem;
    color: ${Colors.SECONDARY};
    margin-bottom: 15px;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  color: ${Colors.PRIMARY};
  margin-bottom: 15px;
  font-weight: 700;
`;

const CardText = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.7;
`;

const ContactSection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px;
  background: ${Colors.TEXT_LIGHT};
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(0, 0, 0, 0.05); 
  border: 1px solid ${Colors.BORDER};
  display: flex;
  gap: 40px;
  align-items: flex-start;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 30px;
  }
`;

const ContactContent = styled.div`
    flex: 1;
`;

const ContactTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 30px;
  color: ${Colors.PRIMARY};

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: left;
  }
`;

const ContactInfoItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    font-size: 1.1rem;
    color: ${Colors.TEXT_DARK};
    font-weight: 500;
    
    svg {
        color: ${Colors.SECONDARY};
        margin-right: 15px;
        font-size: 1.6rem;
    }
`;

const MapFrame = styled.iframe`
  flex: 1.5;
  min-height: 450px;
  border: 1px solid ${Colors.BORDER};
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  @media (max-width: 992px) {
    width: 100%;
    margin-top: 30px;
  }
`;

const Footer = styled.footer`
  margin-top: 100px;
  text-align: center;
  font-size: 0.9rem;
  color: #888;
  padding: 30px 0;
  width: 100%;
  border-top: 1px solid ${Colors.BORDER};
`;

// ===== Component =====
const AboutUsScreen = () => {
  return (
    <Wrapper id="aboutus">
      <ContentWrapper>
        {/* Hero Section */}
        <HeroSection>
          <Title>Notre Histoire, Notre Engagement</Title>
          <SubTitle>
            Vergers des Vallonières, situé à Saint-Berthevin (53940), incarne l'excellence
            artisanale. Nous fournissons des matériaux durables et esthétiques,
            ancrés dans une tradition locale et un profond respect de l'environnement.
          </SubTitle>
        </HeroSection>

        {/* Info Cards */}
        <CardGrid>
          <Card>
            <CardIcon><FaSeedling /></CardIcon>
            <CardTitle>Qualité & Durabilité</CardTitle>
            <CardText>
              Nous sélectionnons rigoureusement nos matières premières pour garantir
              des produits d'une qualité supérieure, conçus pour durer et minimiser
              notre impact écologique.
            </CardText>
          </Card>

          <Card>
            <CardIcon><FaHandsHelping /></CardIcon>
            <CardTitle>Partenariat Local</CardTitle>
            <CardText>
              Notre engagement est de soutenir l'économie locale. Tous nos produits
              sont issus de circuits courts et valorisent le savoir-faire
              régional.
            </CardText>
          </Card>

          <Card>
            <CardIcon><FaCogs /></CardIcon>
            <CardTitle>Savoir-faire Authentique</CardTitle>
            <CardText>
              L'artisanat est au cœur de notre identité. Nous appliquons des
              méthodes traditionnelles, mariées aux techniques modernes, pour
              atteindre l'excellence.
            </CardText>
          </Card>
        </CardGrid>

        {/* Contact Section - Integrated for professional layout */}
        <ContactSection>
            <ContactContent>
                <ContactTitle>Information Clés</ContactTitle>
                <ContactInfoItem>
                    <FaMapMarkerAlt />
                    <span>4 Rue du Petit Gravier, 53940 Saint-Berthevin, France</span>
                </ContactInfoItem>
                <ContactInfoItem>
                    <FaPhoneAlt />
                    <span>+33 2 43 69 12 34</span>
                </ContactInfoItem>
                <ContactInfoItem>
                    <FaEnvelopeOpenText />
                    <span>contact@lepetitgravier.fr</span>
                </ContactInfoItem>
            </ContactContent>
            
            {/* Using a placeholder for the map source */}
            <MapFrame
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2689.153728390298!2d-0.8184!3d48.0709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4808b9c55a5b6b05%3A0xabc!2sSaint-Berthevin%2053940!5e0!3m2!1sen!2sfr!4v1700000000000" 
              loading="lazy"
              allowFullScreen
            />
        </ContactSection>

        {/* Footer */}
        <Footer>
          &copy; {new Date().getFullYear()} Vergers des Vallonières. Tous droits réservés.
        </Footer>
      </ContentWrapper>
    </Wrapper>
  );
};

export default AboutUsScreen;
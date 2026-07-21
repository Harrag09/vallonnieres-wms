// ======================================
// COMPOSANT ZONE DE SORTIE (PivotZone.js)
// ======================================
import React from "react";
import styled, { keyframes } from "styled-components";
import { Truck, ArrowRightCircle } from "lucide-react";

// ======================================
// STYLED COMPONENTS DÉDIÉS
// ======================================
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const PreparationZone = styled.section`
  margin-top: 32px;
  background: #fff1f2;
  border-radius: 14px;
  border: 1px dashed #f43f5e;
  padding: 20px;
  
  h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 700;
    color: #9f1239;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ProcessingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const ProcessingItem = styled.div`
  background: white;
  border: 1px solid #fecdd3;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  animation: ${pulseAnimation} 2s infinite;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    
    strong { color: #881337; font-size: 15px; }
    span { 
      font-size: 11px; 
      font-weight: 700; 
      background: #ffe4e6; 
      color: #e11d48; 
      padding: 4px 8px; 
      border-radius: 6px; 
    }
  }

  .details {
    font-size: 13px;
    color: #4c1d95;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const ActionButton = styled.button`
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  background: #e11d48;
  color: white;
  transition: background 0.2s;
  
  &:hover { background: #be123c; }
`;

// ======================================
// COMPOSANT PRINCIPAL
// ======================================
export default function PivotZone({ processingPaloxList, onFinalize }) {
  if (!processingPaloxList || processingPaloxList.length === 0) {
    return null; // On n'affiche la zone que s'il y a des palox en cours de sortie
  }

  return (
    <PreparationZone>
      <h3><Truck size={18} /> Zone de Préparation (Sorties en cours)</h3>
      <ProcessingGrid>
        {processingPaloxList.map(item => (
          // Utilisation de _id généré par MongoDB comme clé unique
          <ProcessingItem key={item._id}>
            <div className="header">
              <strong>{item.barcode}</strong>
              <span>En cours</span>
            </div>
            
            <div className="details">
              {item.productDetails?.icon} 
              {item.productDetails?.name} 
              ({item.caliber})
            </div>
            
            <ActionButton onClick={() => onFinalize(item)}>
              <ArrowRightCircle size={16} /> Finaliser la Sortie
            </ActionButton>
          </ProcessingItem>
        ))}
      </ProcessingGrid>
    </PreparationZone>
  );
}
/**
 * ========================================================================
 * COMPOSANT ZONE PIVOT (PivotZone.js)
 * Optimisé pour le scroll fluide et l'interface tactile (Mobile/Tablette)
 * ========================================================================
 */
import React from "react";
import styled from "styled-components";
import { ArrowRightLeft, AlertCircle, CheckCircle2, Truck, HardHat } from "lucide-react";

// ======================================
// STYLED COMPONENTS (Optimisés Mobile)
// ======================================
const ZoneContainer = styled.section`
  margin-top: 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  /* Assure une bonne gestion tactile */
  touch-action: pan-y;
  overscroll-behavior-y: contain; 
`;

const Header = styled.header`
  background: #0f172a;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #f8fafc;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .counter {
    background: #2563eb;
    color: #ffffff;
    font-size: 12px;
    padding: 2px 10px;
    border-radius: 99px;
  }
`;

const KanbanGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* 1 colonne sur mobile */
  gap: 16px;
  padding: 16px;
  background: #f8fafc;

  @media(min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
`;

const TaskCard = styled.article`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 6px solid ${props => props.$productColor || "#94a3b8"};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.99); /* Feedback tactile immédiat */
  }
`;

const CardBody = styled.div`
  padding: 16px;

  .barcode {
    font-family: monospace;
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
  }

  .detail-item {
    dt { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; }
    dd { margin: 0; font-size: 14px; font-weight: 700; color: #1e293b; }
  }
`;

const DispatchButton = styled.button`
  width: 100%;
  border: none;
  background: #059669;
  color: white;
  padding: 16px; /* Bouton très large pour éviter les erreurs de clic */
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 0 0 12px 12px;

  &:active { background: #047857; }
`;

export default function PivotZone({ processingPaloxList = [], onFinalize }) {
  const hasTasks = processingPaloxList.length > 0;

  return (
    <ZoneContainer>
      <Header>
        <h3>
          <ArrowRightLeft size={20} />
          Quai de Transit
        </h3>
        {hasTasks && <span className="counter">{processingPaloxList.length}</span>}
      </Header>

      {!hasTasks ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
          <CheckCircle2 size={32} style={{ margin: "0 auto 12px" }} />
          Zone libre de toute tâche.
        </div>
      ) : (
        <KanbanGrid>
          {processingPaloxList.map((item) => (
            <TaskCard key={item.id} $productColor={item.productDetails?.color}>
              <CardBody>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="barcode">{item.barcode}</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#475569", background: "#e2e8f0", padding: "2px 8px", borderRadius: "6px" }}>
                    {item.supplierId}
                  </span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: "800", marginTop: "8px" }}>
                  {item.productDetails?.icon} {item.productDetails?.name}
                </div>
                <dl className="details-grid">
                  <div className="detail-item"><dt>Calibre</dt><dd>{item.caliber}</dd></div>
                  <div className="detail-item"><dt>Poids</dt><dd>{item.weight} kg</dd></div>
                </dl>
              </CardBody>
              <DispatchButton onClick={() => onFinalize(item)}>
                <Truck size={20} />
                Valider l'expédition
              </DispatchButton>
            </TaskCard>
          ))}
        </KanbanGrid>
      )}
    </ZoneContainer>
  );
}
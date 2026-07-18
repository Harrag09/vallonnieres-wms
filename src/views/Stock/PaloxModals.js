/**
 * ========================================================================
 * COMPOSANTS MODAUX MOBILES (PaloxModals.js)
 * Design "Bottom Sheet" professionnel, adapté aux tablettes tactiles.
 * ========================================================================
 */
import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { X, Plus, Move, HardHat, Box } from "lucide-react";
import { PRODUCTS, COLD_ROOMS, CALIBERS, FOURNISSEURS } from "./data";

// ======================================
// ANIMATIONS ET STYLES DE BASE
// ======================================
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease-out;

  @media(min-width: 768px) {
    align-items: center;
    padding: 24px;
  }
`;

const SheetContent = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 24px 24px 0 0;
  padding: 24px;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: #cbd5e1;
    border-radius: 4px;
  }

  @media(min-width: 768px) {
    border-radius: 16px;
    &::before { display: none; }
  }
`;

// ======================================
// COMPOSANT WRAPPER UNIVERSEL (Anti-scroll)
// ======================================
const WMSModalWrapper = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <SheetContent>{children}</SheetContent>
    </Overlay>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 24px;

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  button {
    background: #f1f5f9;
    border: none;
    color: #475569;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:active { transform: scale(0.95); background: #e2e8f0; }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 700;
    color: #334155;
  }
`;

const SelectInput = styled.select`
  height: 54px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  color: #0f172a;
  font-weight: 600;
  font-size: 16px;
  outline: none;
  width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 16px top 50%;
  background-size: 14px auto;

  &:focus {
    border-color: #2563eb;
    background-color: #ffffff;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  background: ${props => props.$color || "#2563eb"};
  color: white;
  margin-top: 12px;
  box-shadow: 0 4px 6px -1px ${props => props.$color ? props.$color + '40' : 'rgba(37, 99, 235, 0.2)'};

  &:active { transform: scale(0.98); }
`;

// ======================================
// MODAL : RÉCEPTION / CRÉATION
// ======================================
export function AddPaloxModal({ isOpen, onClose, newPalox, setNewPalox, addingRoomLocations, onCreate }) {
  return (
    <WMSModalWrapper isOpen={isOpen} onClose={onClose}>
      <Header>
        <h3><Plus size={24} color="#2563eb" /> Nouvelle Réception</h3>
        <button onClick={onClose} aria-label="Fermer"><X size={24} /></button>
      </Header>
      
      <form onSubmit={onCreate}>
        <FormGrid>
          <FormGroup>
            <label><HardHat size={16} style={{display: 'inline', marginRight: '6px', verticalAlign: 'sub'}}/> FOURNISSEURS</label>
            <SelectInput 
              value={newPalox.supplierId || ""} 
              onChange={e => setNewPalox({ ...newPalox, supplierId: e.target.value })}
              required
            >
              <option value="" disabled>Sélectionner l'origine...</option>
              {FOURNISSEURS.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.id} - {sup.name}</option>
              ))}
            </SelectInput>
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormGroup>
              <label>Variété</label>
              <SelectInput value={newPalox.productId} onChange={e => setNewPalox({ ...newPalox, productId: Number(e.target.value) })}>
                {Object.values(PRODUCTS).map(p => <option key={p.id} value={p.id}>{p.icon} {p.short}</option>)}
              </SelectInput>
            </FormGroup>

            <FormGroup>
              <label>Calibre</label>
              <SelectInput value={newPalox.caliber} onChange={e => setNewPalox({ ...newPalox, caliber: e.target.value })}>
                {CALIBERS.map(c => <option key={c} value={c}>{c}</option>)}
              </SelectInput>
            </FormGroup>
          </div>

          <FormGroup>
            <label><Box size={16} style={{display: 'inline', marginRight: '6px', verticalAlign: 'sub'}}/> Type de Palox</label>
            <SelectInput 
              value={newPalox.type || "120/100"} 
              onChange={e => setNewPalox({ ...newPalox, type: e.target.value })}
            >
              <option value="120/100">120 x 100 cm</option>
              <option value="120/120">120 x 120 cm</option>
            </SelectInput>
          </FormGroup>

          <FormGroup>
            <label>Destination (Chambre & Slot)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <SelectInput value={newPalox.coldRoomId} onChange={e => setNewPalox({ ...newPalox, coldRoomId: Number(e.target.value), location: "A1" })}>
                {COLD_ROOMS.map(r => <option key={r.id} value={r.id}>{r.name.split('(')[0]}</option>)}
              </SelectInput>
              
              <SelectInput value={newPalox.location} onChange={e => setNewPalox({ ...newPalox, location: e.target.value })}>
                {addingRoomLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </SelectInput>
            </div>
          </FormGroup>

          <SubmitButton type="submit">Valider l'entrée</SubmitButton>
        </FormGrid>
      </form>
    </WMSModalWrapper>
  );
}

// ======================================
// MODAL : DÉPLACEMENT MÉCANIQUE
// ======================================
export function MovePaloxModal({ transferringPalox, roomLocations, onClose, onMove }) {
  const isOpen = transferringPalox !== null;

  return (
    <WMSModalWrapper isOpen={isOpen} onClose={onClose}>
      {transferringPalox && (
        <>
          <Header>
            <h3><Move size={24} color="#f59e0b" /> Ordre de Transfert</h3>
            <button onClick={onClose}><X size={24} /></button>
          </Header>

          <div style={{ background: "#fef3c7", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #fde68a" }}>
            <strong style={{ display: "block", fontSize: "18px", color: "#92400e" }}>ID: {transferringPalox.barcode}</strong>
            <span style={{ fontSize: "14px", color: "#b45309", fontWeight: 600 }}>Départ : {COLD_ROOMS.find(r => r.id === transferringPalox.coldRoomId)?.name.split('(')[0]} (Slot {transferringPalox.location})</span>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            onMove(formData.get("room"), formData.get("position"));
          }}>
            <FormGrid>
              <FormGroup>
                <label>Chambre de Destination</label>
                <SelectInput name="room" defaultValue={transferringPalox.coldRoomId}>
                  {COLD_ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </SelectInput>
              </FormGroup>

              <FormGroup>
                <label>Slot Cible</label>
                <SelectInput name="position">
                  {roomLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </SelectInput>
              </FormGroup>

              <SubmitButton type="submit" $color="#f59e0b">Confirmer le Transfert</SubmitButton>
            </FormGrid>
          </form>
        </>
      )}
    </WMSModalWrapper>
  );
}
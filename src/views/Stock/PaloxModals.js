// ======================================
// COMPOSANTS DES MODALES (PaloxModals.js)
// ======================================
import React, { useState } from "react";
import styled from "styled-components";
import { X, Plus, Move } from "lucide-react";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 14px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    margin-top: 14px;
  }
`;

const SelectInput = styled.select`
  height: 46px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px;
  color: #334155;
  font-weight: 500;
  outline: none;
  width: 100%;
`;

const StyledButton = styled.button`
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${p => p.variant === "danger" ? "#fef2f2" : p.variant === "success" ? "#ecfdf5" : "#f0f5ff"};
  color: ${p => p.variant === "danger" ? "#ef4444" : p.variant === "success" ? "#10b981" : "#2563eb"};
  width: 100%;
  
  &:hover {
    background: ${p => p.variant === "danger" ? "#ef4444" : p.variant === "success" ? "#10b981" : "#2563eb"};
    color: white;
  }
`;

// ======================================
// MODALE D'AJOUT DE PALOX
// ======================================
export function AddPaloxModal({
  PRODUCTS,
  COLD_ROOMS,
  CALIBERS,
  isOpen,
  onClose,
  newPalox,
  setNewPalox,
  addingRoomLocations,
  onCreate
}) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3>Réceptionner un Nouveau Palox</h3>
          <X size={20} onClick={onClose} style={{ cursor: "pointer", color: "#64748b" }} />
        </div>

        <form onSubmit={onCreate}>
          <div>
            <label>Variété de Fruit :</label>
            <SelectInput
              value={newPalox.productId}
              onChange={e => setNewPalox({ ...newPalox, productId: e.target.value })}
            >
              {Object.values(PRODUCTS).map(p => (
                <option key={p._id} value={p._id}>
                  {p.icon} {p.name}
                </option>
              ))}
            </SelectInput>
          </div>

          <div>
            <label>Calibre :</label>
            <SelectInput
              value={newPalox.caliber}
              onChange={e => setNewPalox({ ...newPalox, caliber: e.target.value })}
            >
              {CALIBERS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </SelectInput>
          </div>

          <div>
            <label>Chambre Froide de Destination :</label>
            <SelectInput
              value={newPalox.coldRoomId}
              onChange={e => {
                const targetRoomId = e.target.value;
                setNewPalox({ ...newPalox, coldRoomId: targetRoomId, location: "A1" });
              }}
            >
              {COLD_ROOMS.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </SelectInput>
          </div>

          <div>
            <label>Emplacement (Allée / Position) :</label>
            <SelectInput
              value={newPalox.location}
              onChange={e => setNewPalox({ ...newPalox, location: e.target.value })}
            >
              {addingRoomLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </SelectInput>
          </div>

          <div>
            <label>Format / Taille du Palox :</label>
            <SelectInput
              value={newPalox.size}
              onChange={e => setNewPalox({ ...newPalox, size: e.target.value })}
            >
              <option value="120/100">120/100 (Standard)</option>
              <option value="120/120">120/120</option>
              {/* <option value="80/120">80/120 (Europe)</option> */}
            </SelectInput>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <StyledButton type="button" onClick={onClose} style={{ background: "#f1f5f9", color: "#475569" }}>
              Annuler
            </StyledButton>
            <StyledButton type="submit" variant="success">
              <Plus size={16} /> Enregistrer et Stocker
            </StyledButton>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

// ======================================
// MODALE DE DÉPLACEMENT DE PALOX
// ======================================
export function MovePaloxModal({
  transferringPalox,
  roomLocations,
  COLD_ROOMS,
  onClose,
  onMove
}) {
  const [targetRoomId, setTargetRoomId] = useState(transferringPalox?.coldRoomId || "");
  const [targetLocation, setTargetLocation] = useState(transferringPalox?.location || "A1");

  if (!transferringPalox) return null;

  // Calcul dynamique des emplacements de la chambre de destination sélectionnée
  const selectedDestRoom = COLD_ROOMS.find(r => r._id === targetRoomId) || COLD_ROOMS[0];
  const destRoomLocations = selectedDestRoom && selectedDestRoom.zones 
    ? selectedDestRoom.zones.flatMap(z => selectedDestRoom.positions.map(p => `${z}${p}`))
    : [];

  const handleExecuteMove = (e) => {
    e.preventDefault();
    onMove(targetRoomId, targetLocation);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3>Déplacer le Palox : {transferringPalox.barcode}</h3>
          <X size={20} onClick={onClose} style={{ cursor: "pointer", color: "#64748b" }} />
        </div>

        <form onSubmit={handleExecuteMove}>
          <div>
            <label>Chambre Froide Cible :</label>
            <SelectInput
              value={targetRoomId}
              onChange={e => {
                const newId = e.target.value;
                setTargetRoomId(newId);
                setTargetLocation("A1");
              }}
            >
              {COLD_ROOMS.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </SelectInput>
          </div>

          <div>
            <label>Nouvel Emplacement :</label>
            <SelectInput
              value={targetLocation}
              onChange={e => setTargetLocation(e.target.value)}
            >
              {destRoomLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </SelectInput>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <StyledButton type="button" onClick={onClose} style={{ background: "#f1f5f9", color: "#475569" }}>
              Annuler
            </StyledButton>
            <StyledButton type="submit">
              <Move size={16} /> Confirmer le Déplacement
            </StyledButton>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}
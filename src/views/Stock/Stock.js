// ======================================
// COMPOSANT MAÎTRE (Stock.js)
// ======================================
import React from "react";
import styled from "styled-components";
import {
  LayoutDashboard, Warehouse as WarehouseIcon, Package, MapPin, Search, Move,
  History, Scale, Plus, Truck, Eye, X
} from "lucide-react";
import ReactLoading from 'react-loading';

import { CALIBERS, getFillLevelColor } from "./data";
import { AddPaloxModal, MovePaloxModal } from "./PaloxModals";
import RoomMapping from "./RoomMapping";
import PivotZone from "./PivotZone";
import { useStockLogic } from "./useStockLogic";



// ======================================
// STYLED COMPONENTS
// ======================================
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  font-family: 'Inter', -apple-system, sans-serif;
  padding: 0;
  padding-top: 40px;
  padding-bottom: 80px;
  @media(min-width: 1024px) {
    flex-direction: row;
    padding-bottom: 0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  @media(min-width: 768px) {
    padding: 32px 40px;
  }
`;

const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  @media(min-width: 768px) {
    flex-direction: row;
    align-items: center;
    margin-bottom: 32px;
  }
`;

const TitleGroup = styled.div`
  h1 {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
    letter-spacing: -0.5px;
  }
  p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  @media(min-width: 768px) {
    h1 { font-size: 26px; }
    p { font-size: 14px; }
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
  overflow-x: auto;
  white-space: nowrap;
  &::-webkit-scrollbar { display: none; }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid ${p => p.active ? "#2563eb" : "#e2e8f0"};
  background: ${p => p.active ? "#f0f5ff" : "#ffffff"};
  color: ${p => p.active ? "#2563eb" : "#64748b"};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }
`;

const MetricsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  @media(min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }
`;

const MetricCard = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .val {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 4px;
  }
  .lbl {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
  }
  .icon-box {
    background: #f1f5f9;
    padding: 8px;
    border-radius: 8px;
    color: #475569;
  }
  @media(min-width: 480px) {
    padding: 20px;
    .val { font-size: 22px; }
    .lbl { font-size: 12px; }
  }
`;

const FiltersRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  background: white;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  @media(min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr repeat(2, 1fr) auto;
    gap: 16px;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
  input {
    border: none;
    background: transparent;
    width: 100%;
    height: 44px;
    outline: none;
    color: #1e293b;
    font-size: 14px;
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

const GridMapContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
`;

const BayCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  span {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 6px;
  }
`;

const ProgressTrack = styled.div`
  height: 6px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
  div {
    height: 100%;
    width: ${p => p.pct}%;
    background: ${p => p.pct > 85 ? "#ef4444" : p.pct > 50 ? "#f59e0b" : "#10b981"};
    transition: width 0.3s;
  }
`;

const PaloxStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaloxItem = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${p => p.color || "#cbd5e1"};
  border-radius: 10px;
  padding: 12px;
  transition: transform 0.15s;
  &:hover { transform: translateY(-2px); }
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
  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
  }
`;

const LogSection = styled.section`
  margin-top: 32px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  @media(max-width: 768px) {
    margin-top: 16px;
  }
`;

const LogItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #e2e8f0;
  font-size: 13px;
  &:last-child { border: none; }
`;

export default function StockManagement() {
  const { state, data, setters, handlers } = useStockLogic();

  if (state.isLoading) {
    return (
      <AppContainer>
        <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "250px" }}>
          <ReactLoading type={'spin'} color={'#000'} height={50} width={50} />
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <MainContent>
        <PageHeader>
          <TitleGroup>
            <h1>Gestion des Stocks Palox</h1>
            <p><WarehouseIcon size={16} /> Suivi interactif des chambres froides</p>
          </TitleGroup>
          <StyledButton onClick={() => setters.setIsAddingPalox(true)} style={{ background: "#2563eb", color: "white", padding: "12px 24px", width: "auto" }}>
            <Plus size={16} /> Réceptionner Palox
          </StyledButton>
        </PageHeader>

        <TabBar>
          {data.COLD_ROOMS.map(room => (
            <TabButton key={room._id} active={state.selectedRoom === room._id} onClick={() => setters.setSelectedRoom(room._id)}>
              <WarehouseIcon size={16} /> {room.name}
            </TabButton>
          ))}
        </TabBar>

        <MetricsGrid>
          <MetricCard>
            <div><div className="lbl">Total Palox</div><div className="val">{data.metrics.totalCount} Palox</div></div>
            <div className="icon-box"><Package size={20} /></div>
          </MetricCard>
          <MetricCard>
            <div><div className="lbl">Masse Totale</div><div className="val">{data.metrics.totalWeight} kg</div></div>
            <div className="icon-box"><Scale size={20} /></div>
          </MetricCard>
          <MetricCard>
            <div><div className="lbl">Occupation Salle</div><div className="val">{data.metrics.occupancyPercentage}%</div></div>
            <div className="icon-box"><WarehouseIcon size={20} /></div>
          </MetricCard>
        </MetricsGrid>

        <FiltersRow>
          <SearchInputWrapper>
            <Search size={18} />
            <input placeholder="Rechercher code ou variété..." value={state.search} onChange={e => setters.setSearch(e.target.value)} />
          </SearchInputWrapper>

          <SelectInput value={state.selectedCaliber} onChange={e => setters.setSelectedCaliber(e.target.value)}>
            <option value="ALL">Tous Calibres</option>
            {CALIBERS.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectInput>

          <SelectInput value={state.selectedProductFilter} onChange={e => setters.setSelectedProductFilter(e.target.value)}>
            <option value="ALL">Toutes Variétés</option>
            {Object.values(data.PRODUCTS).map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </SelectInput>

          <StyledButton onClick={() => setters.setIsPreviewingRoom(true)} style={{ background: "#0284c7", color: "white", height: "46px" }}>
            <Eye size={16} /> Plan Cartographie
          </StyledButton>
        </FiltersRow>

        <GridMapContainer>
          {data.roomLocations.map(locCode => {
            const locPaloxList = data.currentRoomStockGrouped[locCode] || [];
            const capacityPercentage = Math.round((locPaloxList.length / data.activeRoom.maxCapacityPerPos) * 100);

            return (
              <BayCard key={locCode}>
                <BayHeader>
                  <h3><MapPin size={16} /> Emplacement {locCode}</h3>
                  <span>{locPaloxList.length}/{data.activeRoom.maxCapacityPerPos} MAX</span>
                </BayHeader>
                <ProgressTrack pct={capacityPercentage}><div /></ProgressTrack>
                <PaloxStack>
                  {locPaloxList.length === 0 ? (
                    <div style={{ color: "#94a3b8", fontSize: "13px", textAlign: "center", padding: "10px 0" }}>Disponible</div>
                  ) : (
                    (() => {
                      const grouped = locPaloxList.reduce((acc, item) => {
                        const key = `${item.productId}_${item.caliber}_${item.fillLevel}`;
                        if (!acc[key]) acc[key] = { ...item, count: 1 };
                        else acc[key].count += 1;
                        return acc;
                      }, {});

                      return Object.values(grouped).map(item => (
                        <PaloxItem key={`${item.productId}-${item.caliber}`} color={item.productDetails?.color}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong style={{ color: "#0f172a" }}>{item.count}x {item.barcode}</strong>
                            <span style={{ fontSize: "11px", fontWeight: "700", background: getFillLevelColor(item.fillLevel), color: "#ffffff", padding: "2px 6px", borderRadius: "4px" }}>
                              {item.fillLevel}
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155", margin: "6px 0" }}>
                            {item.productDetails?.icon} {item.productDetails?.name} ({item.caliber})
                          </div>
                          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                            <StyledButton onClick={() => setters.setTransferringPalox(item)}>
                              <Move size={12} /> Déplacer
                            </StyledButton>
                            <StyledButton variant="danger" onClick={() => handlers.initiateTransit(item, locCode)}>
                              <Truck size={12} /> Sortie
                            </StyledButton>
                          </div>
                        </PaloxItem>
                      ));
                    })()
                  )}
                </PaloxStack>
              </BayCard>
            );
          })}
        </GridMapContainer>

        <PivotZone 
          processingPaloxList={data.processingPaloxList} 
          onFinalize={(item) => { 
            setters.setFinalizingPalox(item); 
            setters.setReturnDetails({ roomId: state.selectedRoom, location: "A1", fillLevel: "2/4" }); 
          }} 
        />

        <LogSection>
          <h3><History size={18} /> Registre des Mouvements de Flux</h3>
          {data.history.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Aucun mouvement enregistré.</p>
          ) : (
            data.history.map((h, i) => (
              <LogItem key={h._id || i}>
                <div><strong style={{ color: h.action === "ENTRÉE" || h.action === "RETOUR" ? "#10b981" : h.action === "TRANSFERT" ? "#3b82f6" : "#ef4444" }}>[{h.action}]</strong> {h.barcode} - {h.desc}</div>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>{new Date(h.timestamp || Date.now()).toLocaleTimeString()}</div>
              </LogItem>
            ))
          )}
        </LogSection>

        <AddPaloxModal
          PRODUCTS={data.PRODUCTS} COLD_ROOMS={data.COLD_ROOMS} CALIBERS={CALIBERS}
          isOpen={state.isAddingPalox} onClose={() => setters.setIsAddingPalox(false)}
          newPalox={state.newPalox} setNewPalox={setters.setNewPalox}
          addingRoomLocations={data.addingRoomLocations} onCreate={handlers.handleCreatePalox}
        />
        
        <MovePaloxModal
          transferringPalox={state.transferringPalox} roomLocations={data.roomLocations}
          COLD_ROOMS={data.COLD_ROOMS} onClose={() => setters.setTransferringPalox(null)} onMove={handlers.handleMovePalox}
        />
        
        {state.finalizingPalox && (
          <ModalOverlay>
            <ModalContent>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ margin: 0 }}>
                  {data.PRODUCTS[state.finalizingPalox.productId]?.icon} {data.PRODUCTS[state.finalizingPalox.productId]?.name} 
                  <span style={{ margin: "0 6px", color: "#64748b" }}>({state.finalizingPalox?.caliber})</span>
                </h3>
                <X size={20} onClick={() => setters.setFinalizingPalox(null)} style={{ cursor: 'pointer' }} />
              </div>

              <form onSubmit={handlers.handleFinalizeProcessing}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Sélectionner les Magasins Destinataires :</label>
                  {data.STORES.map(store => (
                    <label key={store} style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "normal", margin: "4px 0" }}>
                      <input 
                        type="checkbox" 
                        checked={state.selectedStores.includes(store)} 
                        onChange={() => setters.setSelectedStores(prev => prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store])} 
                      /> 
                      {store}
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label>Volume Restant :</label>
                  <SelectInput 
                    value={state.returnDetails.fillLevel} 
                    onChange={e => setters.setReturnDetails({ ...state.returnDetails, fillLevel: e.target.value })}
                  >
                    <option value="Plein">Plein (100%)</option>
                    <option value="3/4">3/4 Restant (75%)</option>
                    <option value="2/4">2/4 Restant (50%)</option>
                    <option value="1/4">1/4 Restant (25%)</option>
                    <option value="Vide">Vide (0% - Sortie Définitive)</option>
                  </SelectInput>

                  {/* POIDS MAJ EN TEMPS RÉEL DÈS QUE fillLevel CHANGE */}
                  <div style={{ 
                    marginTop: "8px", 
                    padding: "8px 12px", 
                    background: "#f1f5f9", 
                    borderRadius: "6px", 
                    fontSize: "13px", 
                    color: "#334155", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between" 
                  }}>
                    <span>Nouveau poids calculé :</span>
                    <strong style={{ color: "#0f172a", fontSize: "14px" }}>{data.currentCalculatedWeight} kg</strong>
                  </div>
                </div>

                {state.returnDetails.fillLevel !== "Vide" && (
                  <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
                    <label style={{ color: "#166534" }}>Emplacement de Retour</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <SelectInput value={state.returnDetails.roomId} onChange={e => setters.setReturnDetails({ ...state.returnDetails, roomId: e.target.value, location: "A1" })}>
                        {data.COLD_ROOMS.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                      </SelectInput>
                      <SelectInput value={state.returnDetails.location} onChange={e => setters.setReturnDetails({ ...state.returnDetails, location: e.target.value })}>
                        {data.modalRoomLocations.map(l => <option key={l} value={l}>{l}</option>)}
                      </SelectInput>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px" }}>
                  <StyledButton type="button" onClick={() => setters.setFinalizingPalox(null)}>Annuler</StyledButton>
                  <StyledButton type="submit" variant="success">Valider la Sortie</StyledButton>
                </div>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}

        {state.isPreviewingRoom && <RoomMapping activeRoom={data.activeRoom} currentRoomStockGrouped={data.currentRoomStockGrouped} onClose={() => setters.setIsPreviewingRoom(false)} />}
      </MainContent>
    </AppContainer>
  );
}
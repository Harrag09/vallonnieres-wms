// ======================================
// COMPOSANT MAÎTRE (Stock.js)
// ======================================
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  LayoutDashboard,
  Warehouse as WarehouseIcon,
  Package,
  MapPin,
  Search,
  Move,
  History,
  Scale,
  Plus,
  Truck,
  Eye,
  X
} from "lucide-react";

// Imports des modules découplés
import { PRODUCTS, COLD_ROOMS, STORES, CALIBERS, calculateWeight, INITIAL_PALOX } from "./data";
import { AddPaloxModal, MovePaloxModal } from "./PaloxModals";
import RoomMapping from "./RoomMapping";
import PivotZone from "./PivotZone";

// ======================================
// STYLED COMPONENTS GÉNÉRAUX
// ======================================
// Dans Stock.js[cite: 3]
const AppContainer = styled.div`  
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  font-family: 'Inter', -apple-system, sans-serif;
  /* Correction des paddings pour mobile */
  padding: 0; 
    padding-top: 40px; 

  padding-bottom: 80px; /* Espace pour éviter le masquage par la navigation */
  
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
  overflow-x: hidden; /* Empêche le défilement latéral global */
  
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
  h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; letter-spacing: -0.5px; }
  p { font-size: 13px; color: #64748b; margin: 0; display: flex; align-items: center; gap: 6px; }
  @media(min-width: 768px) { h1 { font-size: 26px; } p { font-size: 14px; } }
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
  &:hover { border-color: #2563eb; color: #2563eb; }
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
  
  .val { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; }
  .lbl { font-size: 11px; color: #64748b; font-weight: 500; text-transform: uppercase; }
  .icon-box { background: #f1f5f9; padding: 8px; border-radius: 8px; color: #475569; }
  
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
  input { border: none; background: transparent; width: 100%; height: 44px; outline: none; color: #1e293b; font-size: 14px; }
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
  h3 { margin: 0; font-size: 15px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px; }
  span { font-size: 11px; font-weight: 700; color: #475569; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; }
`;

const ProgressTrack = styled.div`
  height: 6px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
  div { height: 100%; width: ${p => p.pct}%; background: ${p => p.pct > 85 ? "#ef4444" : p.pct > 50 ? "#f59e0b" : "#10b981"}; transition: width 0.3s; }
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
  
  label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
`;

const LogSection = styled.section`
  margin-top: 32px; // Réduisez cette valeur à 16px pour tester sur mobile
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

// ======================================
// ENSEMBLE DE LA LOGIQUE D'ORCHESTRATION
// ======================================
export default function StockManagement() {
  const [palox, setPalox] = useState(INITIAL_PALOX);
  const [history, setHistory] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(1);

  const [search, setSearch] = useState("");
  const [selectedCaliber, setSelectedCaliber] = useState("ALL");
  const [selectedProductFilter, setSelectedProductFilter] = useState("ALL");

  const [transferringPalox, setTransferringPalox] = useState(null);
  const [finalizingPalox, setFinalizingPalox] = useState(null);
  const [isAddingPalox, setIsAddingPalox] = useState(false);
  const [isPreviewingRoom, setIsPreviewingRoom] = useState(false);
  const [selectedStores, setSelectedStores] = useState([]);

  const [newPalox, setNewPalox] = useState({
    productId: 1,
    caliber: "70g - 85g",
    coldRoomId: 1,
    location: "A1",
    size: "120/100"
  });

  const [returnDetails, setReturnDetails] = useState({
    roomId: 1,
    location: "A1",
    fillLevel: "2/4"
  });

  const activeRoom = useMemo(() => {
    return COLD_ROOMS.find(r => r.id === selectedRoom) || COLD_ROOMS[0];
  }, [selectedRoom]);

  const roomLocations = useMemo(() => {
    return activeRoom.zones.flatMap(z => activeRoom.positions.map(p => `${z}${p}`));
  }, [activeRoom]);

  const addingRoomLocations = useMemo(() => {
    const target = COLD_ROOMS.find(r => r.id === Number(newPalox.coldRoomId)) || COLD_ROOMS[0];
    return target.zones.flatMap(z => target.positions.map(p => `${z}${p}`));
  }, [newPalox.coldRoomId]);

  const modalRoomLocations = useMemo(() => {
    const target = COLD_ROOMS.find(r => r.id === Number(returnDetails.roomId)) || COLD_ROOMS[0];
    return target.zones.flatMap(z => target.positions.map(p => `${z}${p}`));
  }, [returnDetails.roomId]);

  const currentRoomStockGrouped = useMemo(() => {
    const map = {};
    roomLocations.forEach(loc => { map[loc] = []; });

    palox.forEach(p => {
      if (p.coldRoomId === selectedRoom && p.status === "STORED") {
        const prod = PRODUCTS[p.productId] || {};
        const matchSearch = p.barcode.toLowerCase().includes(search.toLowerCase()) || prod.name?.toLowerCase().includes(search.toLowerCase());
        const matchCaliber = selectedCaliber === "ALL" || p.caliber === selectedCaliber;
        const matchProd = selectedProductFilter === "ALL" || p.productId === Number(selectedProductFilter);

        if (matchSearch && matchCaliber && matchProd) {
          if (map[p.location]) map[p.location].push({ ...p, productDetails: prod });
        }
      }
    });
    return map;
  }, [palox, selectedRoom, roomLocations, search, selectedCaliber, selectedProductFilter]);

  const processingPaloxList = useMemo(() => {
    return palox.filter(p => p.status === "PROCESSING").map(p => ({
      ...p,
      productDetails: PRODUCTS[p.productId] || {}
    }));
  }, [palox]);

  const metrics = useMemo(() => {
    const items = palox.filter(p => p.coldRoomId === selectedRoom && p.status === "STORED");
    const totalWeight = items.reduce((acc, curr) => acc + curr.weight, 0);
    const totalPossibleSlots = roomLocations.length * activeRoom.maxCapacityPerPos;
    return {
      totalCount: items.length,
      totalWeight,
      occupancyPercentage: totalPossibleSlots > 0 ? Math.round((items.length / totalPossibleSlots) * 100) : 0
    };
  }, [palox, selectedRoom, roomLocations, activeRoom]);

  const handleMovePalox = (targetRoomId, targetLocation) => {
    if (!transferringPalox) return;
    const destRoom = COLD_ROOMS.find(r => r.id === Number(targetRoomId));
    
  const currentOccupancy = palox.filter(p => p.coldRoomId === Number(targetRoomId) && p.location === targetLocation && p.status === "STORED").length;
if (currentOccupancy >= destRoom.maxCapacityPerPos) {
  alert("Emplacement saturé !");
  return;
}

    setPalox(prev => prev.map(item => item.id === transferringPalox.id ? { ...item, coldRoomId: Number(targetRoomId), location: targetLocation } : item));
    setHistory(prev => [{ action: "TRANSFERT", barcode: transferringPalox.barcode, desc: `Déplacé vers ${destRoom.name} [${targetLocation}]`, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    setTransferringPalox(null);
  };

  const handleCreatePalox = (e) => {
    e.preventDefault();
    // 1. Identification de la cible
  const targetRoom = COLD_ROOMS.find(r => r.id === Number(newPalox.coldRoomId));
  
  // 2. Vérification de la saturation de l'emplacement choisi
  const currentOccupancy = palox.filter(p => 
    p.coldRoomId === Number(newPalox.coldRoomId) && 
    p.location === newPalox.location && 
    p.status === "STORED"
  ).length;

  if (currentOccupancy >= targetRoom.maxCapacityPerPos) {
    alert("Impossible d'ajouter : Emplacement saturé !");
    return; // Arrête la création
  }
    const weight = calculateWeight(newPalox.size, "Plein");
    const generatedBarcode = `PLX-${Math.floor(1000 + Math.random() * 9000)}`;

    const item = {
      id: Date.now(),
      barcode: generatedBarcode,
      productId: Number(newPalox.productId),
      caliber: newPalox.caliber,
      coldRoomId: Number(newPalox.coldRoomId),
      location: newPalox.location,
      size: newPalox.size,
      weight,
      fillLevel: "Plein",
      status: "STORED",
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setPalox(prev => [...prev, item]);
    setHistory(prev => [{ action: "ENTRÉE", barcode: generatedBarcode, desc: `Réceptionné dans ${targetRoom.name} [${newPalox.location}]`, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    setIsAddingPalox(false);
  };

  const handleFinalizeProcessing = (e) => {
    e.preventDefault();
    if (!finalizingPalox) return;
    const computedWeight = calculateWeight(finalizingPalox.size, returnDetails.fillLevel);
    const destStores = selectedStores.length > 0 ? selectedStores.join(", ") : "Non spécifié";

    if (returnDetails.fillLevel === "Vide" || computedWeight === 0) {
      setPalox(prev => prev.filter(p => p.id !== finalizingPalox.id));
      setHistory(prev => [{ action: "VIDÉ", barcode: finalizingPalox.barcode, desc: `Livré à : ${destStores}. Palox recyclé.`, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    } else {
      setPalox(prev => prev.map(p => p.id === finalizingPalox.id ? { ...p, status: "STORED", fillLevel: returnDetails.fillLevel, weight: computedWeight, coldRoomId: Number(returnDetails.roomId), location: returnDetails.location } : p));
      setHistory(prev => [{ action: "RETOUR", barcode: finalizingPalox.barcode, desc: `Reliquat réintégré (${returnDetails.fillLevel} - ${computedWeight}kg). Distribué : ${destStores}`, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    }
    setFinalizingPalox(null);
    setSelectedStores([]);
  };

  return (
    <AppContainer>
    

      <MainContent>
        <PageHeader>
          <TitleGroup>
            {/* <h1>Supervision Technique des Palox</h1>
            <p>Gestion unifiée des stocks et des flux de maturation</p> */}
          </TitleGroup>
          <StyledButton onClick={() => setIsAddingPalox(true)} style={{ background: "#2563eb", color: "white", padding: "12px 24px", width: "auto" }}>
            <Plus size={16} /> Réceptionner Palox
          </StyledButton>
        </PageHeader>

        <TabBar>
          {COLD_ROOMS.map(room => (
            <TabButton key={room.id} active={selectedRoom === room.id} onClick={() => setSelectedRoom(room.id)}>
              <WarehouseIcon size={16} /> {room.name}
            </TabButton>
          ))}
        </TabBar>

        <MetricsGrid>
          <MetricCard>
            <div><div className="lbl">Total Palox</div><div className="val">{metrics.totalCount} Palox</div></div>
            <div className="icon-box"><Package size={20} /></div>
          </MetricCard>
          <MetricCard>
            <div><div className="lbl">Masse Totale</div><div className="val">{metrics.totalWeight} kg</div></div>
            <div className="icon-box"><Scale size={20} /></div>
          </MetricCard>
          <MetricCard>
            <div><div className="lbl">Occupation Salle</div><div className="val">{metrics.occupancyPercentage}%</div></div>
            <div className="icon-box"><WarehouseIcon size={20} /></div>
          </MetricCard>
        </MetricsGrid>

        <FiltersRow>
          <SearchInputWrapper>
            <Search size={18} />
            <input placeholder="Rechercher code ou variété..." value={search} onChange={e => setSearch(e.target.value)} />
          </SearchInputWrapper>

          <SelectInput value={selectedCaliber} onChange={e => setSelectedCaliber(e.target.value)}>
            <option value="ALL">Tous Calibres</option>
            {CALIBERS.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectInput>

          <SelectInput value={selectedProductFilter} onChange={e => setSelectedProductFilter(e.target.value)}>
            <option value="ALL">Toutes Variétés</option>
            {Object.values(PRODUCTS).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </SelectInput>

          <StyledButton onClick={() => setIsPreviewingRoom(true)} style={{ background: "#0284c7", color: "white", height: "46px" }}>
            <Eye size={16} /> Plan Cartographie
          </StyledButton>
        </FiltersRow>

        <GridMapContainer>
          {roomLocations.map(locCode => {
            const locPaloxList = currentRoomStockGrouped[locCode] || [];
            const capacityPercentage = Math.round((locPaloxList.length / activeRoom.maxCapacityPerPos) * 100);

            return (
              <BayCard key={locCode}>
                <BayHeader>
                  <h3><MapPin size={16} /> Emplacement {locCode}</h3>
                  <span>{locPaloxList.length}/{activeRoom.maxCapacityPerPos} MAX</span>
                </BayHeader>
                <ProgressTrack pct={capacityPercentage}><div /></ProgressTrack>
<PaloxStack>
  {locPaloxList.length === 0 ? (
    <div style={{ color: "#94a3b8", fontSize: "13px", textAlign: "center", padding: "10px 0" }}>Disponible</div>
  ) : (
    (() => {
      // Regroupement par produit et calibre
      const grouped = locPaloxList.reduce((acc, item) => {
        const key = `${item.productId}_${item.caliber}`;
        if (!acc[key]) acc[key] = { ...item, count: 1 };
        else acc[key].count += 1;
        return acc;
      }, {});

      return Object.values(grouped).map(item => (
        <PaloxItem key={`${item.productId}-${item.caliber}`} color={item.productDetails.color}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Design identique : le code barre affiche maintenant la quantité groupée */}
            <strong style={{ color: "#0f172a" }}>{item.count}x {item.barcode}</strong>
            <span style={{ fontSize: "11px", fontWeight: "700", background: "#edf2f7", padding: "2px 6px", borderRadius: "4px" }}>
              {item.fillLevel}
            </span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155", margin: "6px 0" }}>
            {item.productDetails.icon} {item.productDetails.name} ({item.caliber})
          </div>
          {/* Les boutons conservent le design StyledButton original */}
          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
            <StyledButton onClick={() => setTransferringPalox(item)}><Move size={12} /> Déplacer</StyledButton>
            <StyledButton variant="danger" onClick={() => setPalox(prev => prev.map(p => p.id === item.id ? { ...p, status: "PROCESSING" } : p))}><Truck size={12} /> Sortie</StyledButton>
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

        <PivotZone processingPaloxList={processingPaloxList} onFinalize={(item) => { setFinalizingPalox(item); setReturnDetails({ roomId: selectedRoom, location: "A1", fillLevel: "2/4" }); }} />

        <LogSection>
          <h3><History size={18} /> Registre des Mouvements de Flux</h3>
          {history.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Aucun mouvement enregistré.</p>
          ) : (
            history.map((h, i) => (
              <LogItem key={i}>
                <div><strong style={{ color: h.action === "ENTRÉE" || h.action === "RETOUR" ? "#10b981" : "#ef4444" }}>[{h.action}]</strong> {h.barcode} - {h.desc}</div>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>{h.timestamp}</div>
              </LogItem>
            ))
          )}
        </LogSection>

        {/* MODAL : RAJOUT */}
        <AddPaloxModal isOpen={isAddingPalox} onClose={() => setIsAddingPalox(false)} newPalox={newPalox} setNewPalox={setNewPalox} addingRoomLocations={addingRoomLocations} onCreate={handleCreatePalox} />

        {/* MODAL : TRANSFERT */}
        <MovePaloxModal transferringPalox={transferringPalox} roomLocations={roomLocations} onClose={() => setTransferringPalox(null)} onMove={handleMovePalox} />

        {/* MODAL : CLÔTURE & DISTRIBUTION */}
        {finalizingPalox && (
          <ModalOverlay>
            <ModalContent>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ margin: 0 }}>Ventilation : {finalizingPalox.barcode}</h3>
                <X size={20} onClick={() => setFinalizingPalox(null)} style={{ cursor: 'pointer' }} />
              </div>
              <form onSubmit={handleFinalizeProcessing}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Sélectionner les Magasins Destinataires :</label>
                  {STORES.map(store => (
                    <label key={store} style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "normal", margin: "4px 0" }}>
                      <input type="checkbox" checked={selectedStores.includes(store)} onChange={() => setSelectedStores(prev => prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store])} /> {store}
                    </label>
                  ))}
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label>Volume Restant :</label>
                  <SelectInput value={returnDetails.fillLevel} onChange={e => setReturnDetails({ ...returnDetails, fillLevel: e.target.value })}>
                    <option value="Plein">Plein (Non touché)</option>
                    <option value="3/4">3/4 Restant</option>
                    <option value="2/4">2/4 Restant (Moitié)</option>
                    <option value="1/4">1/4 Restant</option>
                    <option value="Vide">Vide (Sortie Définitve)</option>
                  </SelectInput>
                </div>
                {returnDetails.fillLevel !== "Vide" && (
                  <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
                    <label style={{ color: "#166534" }}>Emplacement de Retour</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <SelectInput value={returnDetails.roomId} onChange={e => setReturnDetails({ ...returnDetails, roomId: Number(e.target.value), location: "A1" })}>{COLD_ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</SelectInput>
                      <SelectInput value={returnDetails.location} onChange={e => setReturnDetails({ ...returnDetails, location: e.target.value })}>{modalRoomLocations.map(l => <option key={l} value={l}>{l}</option>)}</SelectInput>
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "12px" }}><StyledButton type="button" onClick={() => setFinalizingPalox(null)}>Annuler</StyledButton><StyledButton type="submit" variant="success">Valider la Sortie</StyledButton></div>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* MODAL : CARTOGRAPHIE RAPIDE */}
        {isPreviewingRoom && <RoomMapping activeRoom={activeRoom} currentRoomStockGrouped={currentRoomStockGrouped} onClose={() => setIsPreviewingRoom(false)} />}
      </MainContent>
    </AppContainer>
  );
}
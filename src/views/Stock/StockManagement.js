// ======================================
// MAIN COMPONENT (StockManagement.js)
// ======================================
import React, { useMemo, useState } from "react";
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
  RotateCcw,
  Eye,
  X
} from "lucide-react";

// Imports des fichiers divisés
import { PRODUCTS, COLD_ROOMS, STORES, calculateWeight, INITIAL_PALOX } from "./data";
import RoomMapping from "./RoomMapping";

// ======================================
// STYLED COMPONENTS (MAIN)
// ======================================
const AppContainer = styled.div`  
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  color: #1e293b;
  font-family: 'Inter', -apple-system, sans-serif;
  padding-bottom: 70px; 
  padding-top: 40px;
  @media(min-width: 1024px) {
    flex-direction: row;
    padding-bottom: 0;
  }
`;

const MobileNavBar = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background: #0f172a;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  z-index: 999;
  justify-content: space-around;
  align-items: center;
  @media(min-width: 1024px) { display: none; }
`;

const MobileNavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  color: ${p => p.active ? "#38bdf8" : "#94a3b8"};
  font-size: 11px;
  font-weight: 500;
  gap: 4px;
  cursor: pointer;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 16px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  @media(min-width: 768px) { padding: 40px; }
`;

const PageHeader = styled.div`
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
  @media(min-width: 768px) { h1 { font-size: 28px; } p { font-size: 14px; } }
`;

const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
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
  box-shadow: ${p => p.active ? "0 4px 12px rgba(37, 99, 235, 0.08)" : "none"};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #2563eb; color: #2563eb; }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  @media(min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
`;

const MetricCard = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .val { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; }
  .lbl { font-size: 11px; color: #64748b; font-weight: 500; }
  .icon-box { background: #f1f5f9; padding: 8px; border-radius: 8px; color: #475569; display: none; }
  
  @media(min-width: 480px) {
    padding: 20px;
    .val { font-size: 22px; }
    .lbl { font-size: 12px; }
    .icon-box { display: block; }
  }
  
  &:last-child {
    grid-column: span 2;
    @media(min-width: 768px) { grid-column: span 1; }
  }
`;

const ControlsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  background: white;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.02);
  
  @media(min-width: 768px) { 
    display: grid;
    grid-template-columns: 2fr repeat(2, 1fr) auto; 
    gap: 16px; 
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 32px;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
  input { border: none; background: transparent; width: 100%; height: 44px; outline: none; color: #1e293b; font-size: 14px; }
`;

const SelectInput = styled.select`
  height: 46px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 14px;
  color: #334155;
  font-weight: 500;
  outline: none;
  width: 100%;
`;

const GridMapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  @media(min-width: 768px) { gap: 20px; }
`;

const BayCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const BayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 { margin: 0; font-size: 15px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px; }
  span { font-size: 11px; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; }
`;

const ProgressTrack = styled.div`
  height: 6px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
  div { height: 100%; width: ${p => p.pct}%; background: ${p => p.pct > 85 ? "#ef4444" : p.pct > 50 ? "#f59e0b" : "#10b981"}; transition: width 0.3s ease; }
`;

const PaloxStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaloxItem = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 5px solid ${p => p.color || "#cbd5e1"};
  border-radius: 12px;
  padding: 12px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.04); }
`;

const PaloxMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin: 8px 0;
  font-size: 12px;
  color: #475569;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${p => p.variant === "danger" ? "#fef2f2" : p.variant === "success" ? "#ecfdf5" : "#f0f5ff"};
  color: ${p => p.variant === "danger" ? "#ef4444" : p.variant === "success" ? "#10b981" : "#2563eb"};
  transition: all 0.15s ease;
  width: 100%;
  
  &:hover {
    background: ${p => p.variant === "danger" ? "#ef4444" : p.variant === "success" ? "#10b981" : "#2563eb"};
    color: white;
  }
`;

const TableSection = styled.div`
  margin-top: 32px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  @media(min-width: 768px) { padding: 24px; }
`;

const ProcessTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
  th, td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; text-align: left; font-size: 14px; }
  th { background: #f8fafc; color: #64748b; font-weight: 600; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  @media(min-width: 768px) { align-items: center; padding: 20px; }
`;

const ModalContent = styled.div`
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 20px;
  width: 100%;
  max-width: ${p => p.maxWidth || "500px"};
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 -10px 25px rgba(0,0,0,0.08);
  
  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
  }

  @media(min-width: 768px) { 
    border-radius: 16px; 
    padding: 28px; 
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); 
    max-height: 90vh;
  }
`;

const LogSection = styled.div`
  margin-top: 32px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  h3 { margin-top: 0; display: flex; align-items: center; gap: 8px; font-size: 16px; }
`;

const LogItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0;
  border-bottom: 1px dashed #e2e8f0;
  font-size: 13px;
  &:last-child { border: none; }
  @media(min-width: 480px) { flex-direction: row; justify-content: space-between; align-items: center; }
`;


// ======================================
// COMPONENT LOGIC
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
    caliber: "90g - 115g",
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
        
        const matchSearch = p.barcode.toLowerCase().includes(search.toLowerCase()) || 
                            prod.name?.toLowerCase().includes(search.toLowerCase());
        const matchCaliber = selectedCaliber === "ALL" || p.caliber === selectedCaliber;
        const matchProd = selectedProductFilter === "ALL" || p.productId === Number(selectedProductFilter);

        if (matchSearch && matchCaliber && matchProd) {
          if (map[p.location]) {
            map[p.location].push({ ...p, productDetails: prod });
          }
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
    
    const destinationRoom = COLD_ROOMS.find(r => r.id === Number(targetRoomId));
    if (!destinationRoom) return;

    const currentOccupancy = palox.filter(p => 
      p.coldRoomId === Number(targetRoomId) && 
      p.location === targetLocation && 
      p.status === "STORED"
    ).length;

    if (currentOccupancy >= destinationRoom.maxCapacityPerPos) {
      alert(`Erreur : L'emplacement ${targetLocation} de la ${destinationRoom.name} est saturé (${currentOccupancy}/${destinationRoom.maxCapacityPerPos} Max).`);
      return;
    }
    
    setPalox(prev => prev.map(item => 
      item.id === transferringPalox.id 
        ? { ...item, coldRoomId: Number(targetRoomId), location: targetLocation } 
        : item
    ));

    setHistory(prev => [
      {
        action: "TRANSFERT",
        barcode: transferringPalox.barcode,
        desc: `Déplacé vers ${destinationRoom.name} [${targetLocation}]`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
    setTransferringPalox(null);
  };

  const handleSendToProcessing = (item) => {
    setPalox(prev => prev.map(p => p.id === item.id ? { ...p, status: "PROCESSING" } : p));
    setHistory(prev => [
      {
        action: "SORTIE",
        barcode: item.barcode,
        desc: `Sortie de stock pour transfert vers Zone Pivot`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  const handleFinalizeProcessing = (e) => {
    e.preventDefault();
    if (!finalizingPalox) return;

    const calculatedNewWeight = calculateWeight(finalizingPalox.size, returnDetails.fillLevel);
    const storesListDesc = selectedStores.length > 0 ? selectedStores.join(", ") : "Aucun magasin";

    if (returnDetails.fillLevel === "Vide" || calculatedNewWeight === 0) {
      setPalox(prev => prev.filter(p => p.id !== finalizingPalox.id));
      setHistory(prev => [
        {
          action: "VIDÉ",
          barcode: finalizingPalox.barcode,
          desc: `Intégralement distribué à : ${storesListDesc}. Palox sorti définitivement.`,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    } else {
      const targetRoom = COLD_ROOMS.find(r => r.id === Number(returnDetails.roomId));
      const currentOccupancy = palox.filter(p => 
        p.coldRoomId === Number(returnDetails.roomId) && 
        p.location === returnDetails.location && 
        p.status === "STORED"
      ).length;

      if (currentOccupancy >= targetRoom?.maxCapacityPerPos) {
        alert(`Impossible de réintroduire : L'emplacement ${returnDetails.location} de la ${targetRoom.name} est plein.`);
        return;
      }

      setPalox(prev => prev.map(p => 
        p.id === finalizingPalox.id 
          ? { 
              ...p, 
              status: "STORED", 
              fillLevel: returnDetails.fillLevel, 
              weight: calculatedNewWeight,
              coldRoomId: Number(returnDetails.roomId),
              location: returnDetails.location
            }
          : p
      ));

      setHistory(prev => [
        {
          action: "RETOUR",
          barcode: finalizingPalox.barcode,
          desc: `Reste réintégré (${returnDetails.fillLevel} - ${calculatedNewWeight}kg) dans ${targetRoom.name} [${returnDetails.location}]. Distribué : ${storesListDesc}`,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }

    setFinalizingPalox(null);
    setSelectedStores([]);
  };

  const handleOpenCreatePalox = (e) => {
    setIsAddingPalox(true)
  }

  const handleCreatePalox = (e) => {
    e.preventDefault();
    
    const targetRoom = COLD_ROOMS.find(r => r.id === Number(newPalox.coldRoomId));
    if (!targetRoom) return;

    const currentOccupancy = palox.filter(p => 
      p.coldRoomId === Number(newPalox.coldRoomId) && 
      p.location === newPalox.location && 
      p.status === "STORED"
    ).length;

    if (currentOccupancy >= targetRoom.maxCapacityPerPos) {
      alert(`Erreur Capacité : L'emplacement ${newPalox.location} dans la ${targetRoom.name} est complet.`);
      return;
    }

    const newId = Date.now();
    const generatedBarcode = `PLX-${Math.floor(1000 + Math.random() * 9000)}`;
    const weight = calculateWeight(newPalox.size, "Plein");
    
    const paloxObject = {
      id: newId,
      barcode: generatedBarcode,
      productId: Number(newPalox.productId),
      caliber: newPalox.caliber,
      coldRoomId: Number(newPalox.coldRoomId),
      location: newPalox.location,
      size: newPalox.size,
      weight: weight,
      fillLevel: "Plein",
      status: "STORED",
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setPalox(prev => [...prev, paloxObject]);
    setHistory(prev => [
      {
        action: "ENTRÉE",
        barcode: generatedBarcode,
        desc: `Réception Palox ${newPalox.size} (${weight}kg) stocké dans ${targetRoom.name} [${newPalox.location}]`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
    setIsAddingPalox(false);
  };

  const toggleStoreSelection = (storeName) => {
    setSelectedStores(prev => 
      prev.includes(storeName) ? prev.filter(s => s !== storeName) : [...prev, storeName]
    );
  };

  return (
    <AppContainer >
      <MobileNavBar>
        <MobileNavButton active><LayoutDashboard size={20}/>Bord</MobileNavButton>
        <MobileNavButton onClick={handleOpenCreatePalox}><Plus size={20}/>Ajouter</MobileNavButton>
        <MobileNavButton onClick={() => setIsPreviewingRoom(true)}><Eye size={20}/>Plan 2D</MobileNavButton>
      </MobileNavBar>

      <MainContent>
        <PageHeader>
          <TitleGroup>
            <h1>Supervision Technique des Palox</h1>
            <p>Visualisation en temps réel de l'état des chambres de maturation</p>
          </TitleGroup>
          <StyledButton 
            onClick={() => setIsAddingPalox(true)} 
            style={{ background: "#2563eb", color: "white", padding: "12px 24px", borderRadius: "12px", width: "auto", display: window.innerWidth < 768 ? 'none' : 'inline-flex' }}
          >
            <Plus size={16}/> Réceptionner Palox
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
            <div>
              <div className="lbl">Total Palox</div>
              <div className="val">{metrics.totalCount} u.</div>
            </div>
            <div className="icon-box"><Package size={20}/></div>
          </MetricCard>
          <MetricCard>
            <div>
              <div className="lbl">Masse Stockée</div>
              <div className="val">{metrics.totalWeight} kg</div>
            </div>
            <div className="icon-box"><Scale size={20}/></div>
          </MetricCard>
          <MetricCard>
            <div>
              <div className="lbl">Taux d'occupation de la salle</div>
              <div className="val">{metrics.occupancyPercentage}%</div>
            </div>
            <div className="icon-box"><WarehouseIcon size={20}/></div>
          </MetricCard>
        </MetricsGrid>

        <ControlsRow>
          <SearchInputWrapper>
            <Search size={18} />
            <input 
              placeholder="Rechercher code ou variété..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
            />
          </SearchInputWrapper>
          
          <SelectInput value={selectedCaliber} onChange={e => setSelectedCaliber(e.target.value)}>
            <option value="ALL">Tous Calibres</option>
            <option value="80g - 90g">Petit (80g - 90g)</option>
            <option value="90g - 115g">Standard (90g - 115g)</option>
            <option value="115g - 130g">Gros (115g - 130g)</option>
          </SelectInput>

          <SelectInput value={selectedProductFilter} onChange={e => setSelectedProductFilter(e.target.value)}>
            <option value="ALL">Toutes Variétés</option>
            {Object.values(PRODUCTS).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </SelectInput>

          <StyledButton 
            onClick={() => setIsPreviewingRoom(true)} 
            style={{ background: "#0284c7", color: "white", padding: "12px 18px", height: "46px", borderRadius: "12px" }}
          >
            <Eye size={16} /> Plan Cartographie
          </StyledButton>
        </ControlsRow>

        <GridMapContainer>
          {roomLocations.map(locCode => {
            const locPaloxList = currentRoomStockGrouped[locCode] || [];
            const capacityPercentage = Math.round((locPaloxList.length / activeRoom.maxCapacityPerPos) * 100);

            return (
              <BayCard key={locCode}>
                <BayHeader>
                  <h3><MapPin size={16} /> {locCode}</h3>
                  <span>{locPaloxList.length} / {activeRoom.maxCapacityPerPos} Max</span>
                </BayHeader>
                
                <ProgressTrack pct={capacityPercentage}><div /></ProgressTrack>

                <PaloxStack>
                  {locPaloxList.length === 0 ? (
                    <div style={{ color: "#94a3b8", fontSize: "13px", fontStyle: "italic", textAlign: "center", padding: "12px 0" }}>Emplacement Vide</div>
                  ) : (
                    locPaloxList.map(item => (
                      <PaloxItem key={item.id} color={item.productDetails.color}>
                        <div style={{ display: "flex", justifycontent: "space-between", alignitems: "center" }}>
                          <strong style={{ fontSize: "14px", color: "#0f172a" }}>{item.barcode}</strong>
                          <span style={{ fontSize: "11px", fontWeight: "700", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", marginLeft: "auto" }}>
                            {item.fillLevel}
                          </span>
                        </div>

                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155", margin: "6px 0 2px 0" }}>
                          {item.productDetails.icon} {item.productDetails.name} <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "normal" }}>({item.caliber})</span>
                        </div>

                        <PaloxMeta>
                          <span>Dim: {item.size}</span>
                          <span><Scale size={12}/> {item.weight} kg</span>
                        </PaloxMeta>

                        <ActionRow>
                          <StyledButton onClick={() => setTransferringPalox(item)}>
                            <Move size={12}/> Déplacer
                          </StyledButton>
                          <StyledButton variant="danger" onClick={() => handleSendToProcessing(item)}>
                            <Truck size={12}/> Sortie
                          </StyledButton>
                        </ActionRow>
                      </PaloxItem>
                    ))
                  )}
                </PaloxStack>
              </BayCard>
            );
          })}
        </GridMapContainer>

        <TableSection>
          <h3>🏭 Zone Pivot : En cours de distribution</h3>
          {processingPaloxList.length === 0 ? (
            <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0, fontSize: "14px" }}>Aucun palox extrait en cours de manipulation.</p>
          ) : (
            <ProcessTable>
              <thead>
                <tr>
                  <th>Code-Barres</th>
                  <th>Produit</th>
                  <th>Format</th>
                  <th>Masse Initiale</th>
                  <th>Action Fin de Poste</th>
                </tr>
              </thead>
              <tbody>
                {processingPaloxList.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.barcode}</strong></td>
                    <td>{item.productDetails.icon} {item.productDetails.name}</td>
                    <td>{item.size}</td>
                    <td><strong>{item.fillLevel} ({item.weight} kg)</strong></td>
                    <td>
                      <StyledButton variant="success" onClick={() => {
                        setFinalizingPalox(item);
                        setSelectedStores([]);
                        setReturnDetails({ roomId: selectedRoom, location: "A1", fillLevel: "2/4" });
                      }}>
                        <RotateCcw size={14} /> Répartir & Clôturer
                      </StyledButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ProcessTable>
          )}
        </TableSection>

        <LogSection>
          <h3><History size={18}/> Registre Continu de Traçabilité</h3>
          {history.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Aucun enregistrement pour le moment.</p>
          ) : (
            history.map((h, i) => (
              <LogItem key={i}>
                <div>
                  <strong style={{ color: h.action === "ENTRÉE" || h.action === "RETOUR" ? "#10b981" : "#ef4444", marginRight: "8px" }}>[{h.action}]</strong>
                  <span>{h.barcode} - {h.desc}</span>
                </div>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>{h.timestamp}</span>
              </LogItem>
            ))
          )}
        </LogSection>

        {/* MODAL : DEPLACEMENT */}
        {transferringPalox && (
          <ModalOverlay>
            <ModalContent>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Déplacement mécanique : {transferringPalox.barcode}</h3>
                <X size={20} onClick={() => setTransferringPalox(null)} style={{ cursor: 'pointer' }}/>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleMovePalox(formData.get("room"), formData.get("position"));
              }}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Chambre Froide Réceptrice</label>
                  <SelectInput name="room" defaultValue={selectedRoom}>
                    {COLD_ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </SelectInput>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label>Position Finale</label>
                  <SelectInput name="position">
                    {roomLocations.map(loc => <option key={loc} value={loc}>Slot local : {loc}</option>)}
                  </SelectInput>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <StyledButton type="button" onClick={() => setTransferringPalox(null)} style={{ background: "#f1f5f9", color: "#475569" }}>Annuler</StyledButton>
                  <StyledButton type="submit" style={{ background: "#2563eb", color: "white" }}>Confirmer le transfert</StyledButton>
                </div>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* MODAL : CREATION / RECEPTION */}
        {isAddingPalox && (
          <ModalOverlay>
            <ModalContent>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Nouvel arrivage : Décharger Palox</h3>
                <X size={20} onClick={() => setIsAddingPalox(false)} style={{ cursor: 'pointer' }}/>
              </div>
              <form onSubmit={handleCreatePalox}>
                <div style={{ marginBottom: "12px" }}>
                  <label>Dimensions Structurelles</label>
                  <SelectInput value={newPalox.size} onChange={e => setNewPalox({...newPalox, size: e.target.value})}>
                    <option value="120/100">120/100 (Standard standardisé)</option>
                    <option value="120/120">120/120 (Grand Cubage)</option>
                  </SelectInput>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label>Variété</label>
                  <SelectInput value={newPalox.productId} onChange={e => setNewPalox({...newPalox, productId: e.target.value})}>
                    {Object.values(PRODUCTS).map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                  </SelectInput>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label>Tri / Calibre</label>
                  <SelectInput value={newPalox.caliber} onChange={e => setNewPalox({...newPalox, caliber: e.target.value})}>
                    <option value="80g - 90g">80g - 90g</option>
                    <option value="90g - 115g">90g - 115g</option>
                    <option value="115g - 130g">115g - 130g</option>
                  </SelectInput>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label>Chambre Cible</label>
                  <SelectInput value={newPalox.coldRoomId} onChange={e => setNewPalox({...newPalox, coldRoomId: e.target.value, location: "A1"})}>
                    {COLD_ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </SelectInput>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label>Emplacement d'Empilement</label>
                  <SelectInput value={newPalox.location} onChange={e => setNewPalox({...newPalox, location: e.target.value})}>
                    {addingRoomLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </SelectInput>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <StyledButton type="button" onClick={() => setIsAddingPalox(false)} style={{ background: "#f1f5f9", color: "#475569" }}>Annuler</StyledButton>
                  <StyledButton type="submit" style={{ background: "#2563eb", color: "white" }}>Enregistrer l'entrée</StyledButton>
                </div>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* MODAL CLOTURE ET FIN DE POSTE */}
        {finalizingPalox && (
          <ModalOverlay>
            <ModalContent>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Répartition : {finalizingPalox.barcode}</h3>
                <X size={20} onClick={() => setFinalizingPalox(null)} style={{ cursor: 'pointer' }}/>
              </div>
              <form onSubmit={handleFinalizeProcessing}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Magasins Destinataires :</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px", background: "#f8fafc", padding: "12px", borderRadius: "12px" }}>
                    {STORES.map(store => (
                      <label key={store} style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "normal", margin: 0 }}>
                        <input type="checkbox" checked={selectedStores.includes(store)} onChange={() => toggleStoreSelection(store)} />
                        {store}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label>État Restant du Palox :</label>
                  <SelectInput value={returnDetails.fillLevel} onChange={e => setReturnDetails({ ...returnDetails, fillLevel: e.target.value })}>
                    <option value="Plein">Plein (Non entamé)</option>
                    <option value="3/4">3/4 Restant</option>
                    <option value="2/4">2/4 Restant (Moitié)</option>
                    <option value="1/4">1/4 Restant</option>
                    <option value="Vide">Vide (Sortie Définitive)</option>
                  </SelectInput>
                </div>
                {returnDetails.fillLevel !== "Vide" && (
                  <div style={{ marginBottom: "20px", background: "#f0fdf4", padding: "14px", borderRadius: "12px", border: "1px solid #bbf7d0" }}>
                    <label style={{ color: "#166534" }}>Emplacement de retour en Chambre</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "6px" }}>
                      <SelectInput value={returnDetails.roomId} onChange={e => setReturnDetails({ ...returnDetails, roomId: e.target.value, location: "A1" })}>
                        {COLD_ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </SelectInput>
                      <SelectInput value={returnDetails.location} onChange={e => setReturnDetails({ ...returnDetails, location: e.target.value })}>
                        {modalRoomLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </SelectInput>
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "12px" }}>
                  <StyledButton type="button" onClick={() => setFinalizingPalox(null)} style={{ background: "#f1f5f9", color: "#475569" }}>Annuler</StyledButton>
                  <StyledButton type="submit" style={{ background: "#10b981", color: "white" }}>Enregistrer la feuille de flux</StyledButton>
                </div>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* MODAL INTERACTIVE CARTOGRAPHIQUE 2D (Importé) */}
        {isPreviewingRoom && (
          <RoomMapping 
            activeRoom={activeRoom} 
            currentRoomStockGrouped={currentRoomStockGrouped} 
            onClose={() => setIsPreviewingRoom(false)} 
          />
        )}
      </MainContent>
    </AppContainer>
  );
}
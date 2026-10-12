import { useState, useEffect, useMemo } from "react";
import StockServise from "Service/StockService";
import { calculateWeight } from "./data";

export function useStockLogic() {
  // --- ÉTATS ---
  const [history, setHistory] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [PRODUCTS, setPRODUCTS] = useState({});
  const [COLD_ROOMS, setCOLD_ROOMS] = useState([]);
  const [STORES, setSTORES] = useState([]);
  const [palox, setPalox] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCaliber, setSelectedCaliber] = useState("ALL");
  const [selectedProductFilter, setSelectedProductFilter] = useState("ALL");

  const [transferringPalox, setTransferringPalox] = useState(null);
  const [finalizingPalox, setFinalizingPalox] = useState(null);
  const [isAddingPalox, setIsAddingPalox] = useState(false);
  const [isPreviewingRoom, setIsPreviewingRoom] = useState(false);
  const [selectedStores, setSelectedStores] = useState([]);

  const userIdMock = "6a5896cbdcd841dea495d174";
  const supplierIdMock = "SUP-01";

  const [newPalox, setNewPalox] = useState({
    productId: "", caliber: "Brut", coldRoomId: "", location: "A1", size: "120/100"
  });

  const [returnDetails, setReturnDetails] = useState({
    roomId: "", location: "A1", fillLevel: "2/4"
  });

  // --- INITIALISATION (MongoDB / API) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await StockServise.getAllPaloxAndAllProductAndCOLD_ROOMS();

        const productsById = (data.data.product || []).reduce((acc, p) => {
          acc[p._id] = p;
          return acc;
        }, {});

        setPRODUCTS(productsById);
        setCOLD_ROOMS(data.data.coldRoom || []);
        setSTORES((data.data.magasin || []).map(m => m.name));
        setPalox(data.data.palox || []);
        setHistory(data.data.history || []);

        if (data.data.coldRoom?.length > 0) {
          const firstRoomId = data.data.coldRoom[0]._id;
          setSelectedRoom(firstRoomId);
          setNewPalox(prev => ({ ...prev, coldRoomId: firstRoomId }));
          setReturnDetails(prev => ({ ...prev, roomId: firstRoomId }));
        }

        if (data.data.product?.length > 0) {
          setNewPalox(prev => ({ ...prev, productId: data.data.product[0]._id }));
        }
      } catch (err) {
        console.error("Erreur de chargement des données :", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- LOGIQUE DÉRIVÉE (Mémorisée) ---
  const activeRoom = useMemo(() => 
    COLD_ROOMS.find(r => r._id === selectedRoom) || COLD_ROOMS[0] || { zones: [], positions: [], maxCapacityPerPos: 0 }
  , [selectedRoom, COLD_ROOMS]);
  
  const roomLocations = useMemo(() => 
    activeRoom?.zones?.flatMap(z => activeRoom.positions.map(p => `${z}${p}`)) || []
  , [activeRoom]);
  
  const addingRoomLocations = useMemo(() => {
    const target = COLD_ROOMS.find(r => r._id === newPalox.coldRoomId) || COLD_ROOMS[0] || { zones: [], positions: [] };
    return target.zones?.flatMap(z => target.positions.map(p => `${z}${p}`)) || [];
  }, [newPalox.coldRoomId, COLD_ROOMS]);

  const modalRoomLocations = useMemo(() => {
    const target = COLD_ROOMS.find(r => r._id === returnDetails.roomId) || COLD_ROOMS[0] || { zones: [], positions: [] };
    return target.zones?.flatMap(z => target.positions.map(p => `${z}${p}`)) || [];
  }, [returnDetails.roomId, COLD_ROOMS]);

  // CALCUL DYNAMIQUE DU POIDS LORS DU CHANGEMENT DE FILL LEVEL
  const currentCalculatedWeight = useMemo(() => {
    if (!finalizingPalox) return 0;
    return calculateWeight(finalizingPalox.size, returnDetails.fillLevel);
  }, [finalizingPalox, returnDetails.fillLevel]);

  const currentRoomStockGrouped = useMemo(() => {
    const map = {};
    roomLocations.forEach(loc => { map[loc] = []; });

    palox.forEach(p => {
      if (p.coldRoomId === selectedRoom && p.status === "STORED") {
        const prod = PRODUCTS[p.productId] || {};
        const matchSearch = p.barcode.toLowerCase().includes(search.toLowerCase()) || prod.name?.toLowerCase().includes(search.toLowerCase());
        const matchCaliber = selectedCaliber === "ALL" || p.caliber === selectedCaliber;
        const matchProd = selectedProductFilter === "ALL" || p.productId === selectedProductFilter;

        if (matchSearch && matchCaliber && matchProd && map[p.location]) {
          map[p.location].push({ ...p, productDetails: prod });
        }
      }
    });
    return map;
  }, [palox, selectedRoom, roomLocations, search, selectedCaliber, selectedProductFilter, PRODUCTS]);

  const processingPaloxList = useMemo(() => 
    palox.filter(p => p.status === "PROCESSING").map(p => ({
      ...p, productDetails: PRODUCTS[p.productId] || {}
    }))
  , [palox, PRODUCTS]);

  const metrics = useMemo(() => {
    const items = palox.filter(p => p.coldRoomId === selectedRoom && p.status === "STORED");
    const totalWeight = items.reduce((acc, curr) => acc + curr.weight, 0);
    const totalPossibleSlots = roomLocations.length * (activeRoom?.maxCapacityPerPos || 0);
    return {
      totalCount: items.length,
      totalWeight,
      occupancyPercentage: totalPossibleSlots > 0 ? Math.round((items.length / totalPossibleSlots) * 100) : 0
    };
  }, [palox, selectedRoom, roomLocations, activeRoom]);

  // --- ACTIONS (Handlers) ---
  const handleMovePalox = async (targetRoomId, targetLocation) => {
    if (!transferringPalox) return;
    const destRoom = COLD_ROOMS.find(r => String(r._id) === String(targetRoomId));
    if (!destRoom) return alert("Erreur : Salle de destination introuvable.");

    const currentOccupancy = palox.filter(p => String(p.coldRoomId) === String(targetRoomId) && p.location === targetLocation && p.status === "STORED").length;
    if (currentOccupancy >= (destRoom.maxCapacityPerPos || 0)) return alert("Emplacement saturé !");

    try {
      const response = await StockServise.MovePalox(transferringPalox._id, targetRoomId, targetLocation, userIdMock, destRoom.name);
      if (response.success) {
        setPalox(prev => prev.map(item => item._id === transferringPalox._id ? { ...item, coldRoomId: targetRoomId, location: targetLocation } : item));
        setHistory(prev => [response.history, ...prev]);
        setTransferringPalox(null);
      }
    } catch (err) {
      alert("Erreur lors du déplacement.");
    }
  };

  const handleCreatePalox = async (e) => {
    e.preventDefault();
    const targetRoom = COLD_ROOMS.find(r => r._id === newPalox.coldRoomId);
    const currentOccupancy = palox.filter(p => p.coldRoomId === newPalox.coldRoomId && p.location === newPalox.location && p.status === "STORED").length;

    if (currentOccupancy >= targetRoom.maxCapacityPerPos) return alert("Emplacement saturé !");

    const payload = {
      barcode: `PLX-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: newPalox.productId,
      caliber: newPalox.caliber,
      coldRoomId: newPalox.coldRoomId,
      location: newPalox.location,
      size: newPalox.size,
      weight: calculateWeight(newPalox.size, "Plein"),
      supplierId: supplierIdMock,
      fillLevel: "Plein",
      status: "STORED",
      dateAdded: `Le ${new Date().toLocaleDateString('fr-FR')} - à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    };

    try {
      const response = await StockServise.AjoutPalox(payload, userIdMock, targetRoom.name);
      if (response.success) {
        setPalox(prev => [...prev, response.data]);
        if (response.history) setHistory(prev => [response.history, ...prev]);
        setIsAddingPalox(false);
      }
    } catch (error) {
      alert("Erreur d'enregistrement !");
    }
  };

  const handleFinalizeProcessing = async (e) => {
    e.preventDefault();
    if (!finalizingPalox) return;
    
    const computedWeight = currentCalculatedWeight;
    const destStores = selectedStores.length > 0 ? selectedStores.join(", ") : "Non spécifié";
    const isDefinitive = returnDetails.fillLevel === "Vide" || computedWeight === 0;
    
    try {
      const response = await StockServise.SortiePalox({
        paloxId: finalizingPalox._id,
        isDefinitive,
        fillLevel: returnDetails.fillLevel,
        weight: computedWeight,
        coldRoomId: returnDetails.roomId,
        location: returnDetails.location,
        destStores,
        userId: userIdMock,
        actionDesc: isDefinitive 
          ? `Livré à : ${destStores}. Palox recyclé.` 
          : `Reliquat réintégré (${returnDetails.fillLevel} - ${computedWeight}kg). Distribué : ${destStores}`
      });

      if (response.success) {
        setPalox(prev => isDefinitive 
          ? prev.filter(p => p._id !== finalizingPalox._id)
          : prev.map(p => p._id === finalizingPalox._id ? { 
              ...p, status: "STORED", fillLevel: returnDetails.fillLevel, weight: computedWeight, coldRoomId: returnDetails.roomId, location: returnDetails.location 
            } : p)
        );
        setHistory(prev => [response.history, ...prev]);
        setFinalizingPalox(null);
        setSelectedStores([]);
      }
    } catch (err) {
      alert("Erreur lors de la finalisation.");
    }
  };

  const initiateTransit = async (item, locCode) => {
    const targetPalox = palox.find(p => 
      p.coldRoomId === selectedRoom && 
      p.location === locCode && 
      p.productId === item.productId && 
      p.caliber === item.caliber && 
      p.fillLevel === item.fillLevel && 
      p.status === "STORED"
    );

    if (targetPalox) {
      try {
        const res = await StockServise.UpdatePaloxStatus(targetPalox._id, "PROCESSING");
        if (res.success) {
          setPalox(prev => prev.map(p => p._id === targetPalox._id ? { ...p, status: "PROCESSING" } : p));
        }
      } catch (e) {
        alert("Erreur de mise en transit.");
      }
    }
  };

  return {
    state: { 
      isLoading, selectedRoom, search, selectedCaliber, selectedProductFilter, 
      transferringPalox, finalizingPalox, isAddingPalox, isPreviewingRoom, 
      newPalox, returnDetails, selectedStores 
    },
    data: { 
      PRODUCTS, COLD_ROOMS, STORES, palox, history, activeRoom, 
      roomLocations, addingRoomLocations, modalRoomLocations, 
      currentRoomStockGrouped, processingPaloxList, metrics, currentCalculatedWeight 
    },
    setters: { 
      setSelectedRoom, setSearch, setSelectedCaliber, setSelectedProductFilter, 
      setTransferringPalox, setFinalizingPalox, setIsAddingPalox, setIsPreviewingRoom, 
      setNewPalox, setReturnDetails, setSelectedStores 
    },
    handlers: { handleMovePalox, handleCreatePalox, handleFinalizeProcessing, initiateTransit }
  };
}
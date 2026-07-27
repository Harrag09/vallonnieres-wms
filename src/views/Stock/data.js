/**
 * ========================================================================
 * CORE DATA & CONFIGURATION (data.js)
 * Architecture stable, immuable et documentée
 * ========================================================================
 */

// Utilisation de Object.freeze pour garantir l'immuabilité des données de référence
export const PRODUCTS = Object.freeze({
  1: { id: 1, name: "Royal Gala", short: "Gala", color: "#ef4444", icon: "🍎", category: "Pomme" },
  2: { id: 2, name: "Golden Delicious", short: "Golden", color: "#eab308", icon: "🍏", category: "Pomme" },
  3: { id: 3, name: "Fuji Apple", short: "Fuji", color: "#f43f5e", icon: "🍎", category: "Pomme" },
  4: { id: 4, name: "Granny Smith", short: "Granny", color: "#22c55e", icon: "🍏", category: "Pomme" }
});

export const FOURNISSEURS = Object.freeze([
  { id: "01", name: "Leroy" },
   { id: "02", name: "Croix de pierre" },
    { id: "03", name: "Atlanpom" },
     { id: "04", name: "Bruno" },
      { id: "05", name: "Coco" },
     { id: "05", name: "cheillo" },

]);
export const HISTORY_LOGS = [
  { action: "ENTRÉE", barcode: "PLX-1234", desc: "Réception initiale", timestamp: "08:00:00" },
  // ... vos données
]; 
export const COLD_ROOMS = Object.freeze([
  { 
    id: 1, 
    name: "Chambre froid 1 ", 
    zones: ["A", "B", "C", "D"], 
    positions: ["1", "2", "3", "4", "5", "6", "7"], 
    maxCapacityPerPos: 7 
  },
  { 
    id: 2, 
    name: "Chambre Froide 2", 
    zones: ["A", "B", "C"], 
    positions: ["1", "2", "3", "4"], 
    maxCapacityPerPos: 6 
  },
  { 
    id: 3, 
    name: "Chambre Froide 3", 
    zones: ["A", "B"], 
    positions: ["1", "2"], 
    maxCapacityPerPos: 8 
  }
]);

export const STORES = Object.freeze([
  "Station de Conditionnement", 
  "Expédition Export", 
  "Marché National", 
  "Usine de Transformation (Jus/Compote)"
]);

export const CALIBERS = Object.freeze([
  "Brut","70-85g", "80-95g", "95-115g", "115-135g", "136-165g", 
  "150-180g", "170-200g", "190-220g", "201-240g", 
  "230-270g", "265-305g", "301-350g", "350-400g", "400g+"
]);

/**
 * Calcule avec précision le poids net estimé d'un palox en fonction de sa tare et de son volume
 * @param {string} size - Dimensions du conteneur (ex: "120/100" ou "120/120")
 * @param {string} fillLevel - Niveau de remplissage ("Plein", "3/4", "1/2", "1/4", "Vide")
 * @returns {number} Poids net estimé en kilogrammes
 */
export const calculateWeight = (size, fillLevel) => {
  const baseWeight = size === "120/120" ? 330 : 280;
  const ratios = {
    "Plein": 1.0,
    "3/4": 0.75,
    "2/4": 0.50,
    "1/4": 0.25,
    "Vide": 0.0
  };
  
  return Math.round(baseWeight * (ratios[fillLevel] ?? 1.0));
};

export const getFillLevelColor = (fillLevel) => {
  switch (fillLevel) {
    case "Plein": return "#10b981";   // Vert
    case "3/4": return "#3b82f6";     // Bleu
    case "2/4":
    case "1/2": return "#f59e0b";     // Orange / Jaune
    case "1/4": return "#ef4444";     // Rouge
    default: return "#cbd5e1";        // Gris par défaut
  }
};
/**
 * Renvoyer la couleur selon le nombre de Palox d'un produit
 */
export const getPaloxCountColor = (count) => {
    if (count < 5) return "#EF4444";   // ROUGE (< 5 Palox)
    if (count < 10) return "#10B981";  // VERT (< 10 Palox)
    if (count < 20) return "#3B82F6";  // BLEU (< 20 Palox)
    return "#8B5CF6";                  // VIOLET (>= 20 Palox)
};
// Données d'initialisation (Mock) intégrant la traçabilité fournisseur
export const INITIAL_PALOX = [
  { id: "1705570001", barcode: "PLX-9001", supplierId: "SUP-01", productId: 1, caliber: "80-95g", coldRoomId: 1, location: "A1", size: "120/100", fillLevel: "Plein", weight: 280, status: "STORED", dateAdded: "2026-07-15" },
  { id: "1705570002", barcode: "PLX-9002", supplierId: "SUP-02", productId: 2, caliber: "115-135g", coldRoomId: 1, location: "A2", size: "120/120", fillLevel: "Plein", weight: 330, status: "STORED", dateAdded: "2026-07-16" },
  { id: "1705570003", barcode: "PLX-9003", supplierId: "SUP-01", productId: 1, caliber: "80-95g", coldRoomId: 2, location: "B1", size: "120/100", fillLevel: "1/2", weight: 140, status: "STORED", dateAdded: "2026-07-17" },
   { id: "1705570004", barcode: "PLX-9003", supplierId: "SUP-01", productId: 1, caliber: "80-95g", coldRoomId: 2, location: "B1", size: "120/100", fillLevel: "1/2", weight: 140, status: "PROCESSING", dateAdded: "2026-07-17" },

  ];













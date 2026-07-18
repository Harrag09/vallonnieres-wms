// ======================================================
// COMPOSANT CARTOGRAPHIE INTERACTIVE 2D (RoomMapping.js)
// ======================================================
import React from "react";
import styled from "styled-components";
import { X, FileText, LayoutGrid } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const ModalContent = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.variant === "success" ? "#10b981" : "#f1f5f9"};
  color: ${props => props.variant === "success" ? "#ffffff" : "#475569"};
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.variant === "success" ? "#059669" : "#e2e8f0"};
  }
`;

const MapScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #0f172a;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
`;

const GridStructure = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(${props => props.cols}, minmax(110px, 1fr)) 80px;
  gap: 8px;
  min-width: 750px;
`;

const CellHeader = styled.div`
  background: #1e293b;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  padding: 8px;
  text-align: center;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GridCell = styled.div`
  min-height: 90px;
  background: ${props => props.hasStock ? "#1e293b" : "#0f172a"};
  border: ${props => props.hasStock ? "1px solid #3b82f6" : "1px dashed #334155"};
  border-radius: 8px;
  padding: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CellLabel = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 9px;
  font-weight: 700;
  color: #475569;
`;

const MiniPalox = styled.div`
  background: #1e293b;
  border-left: 3px solid ${props => props.color || "#cbd5e1"};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 4px 6px;
  color: #ffffff;

  .title {
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .details {
    font-size: 9px;
    color: #94a3b8;
    margin-top: 1px;
  }
`;

const EmptyIndicator = styled.span`
  margin: auto;
  font-size: 11px;
  color: #475569;
  font-weight: 500;
`;

const DoorBlock = styled.div`
  background: #ef4444;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
`;

export default function RoomMapping({ activeRoom, currentRoomStockGrouped, onClose }) {
const exportToPDF = () => {
  // Création du document A4 Paysage (Largeur : 297mm)
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  
  // --- EN-TÊTE PREMIUM ---
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 297, 24, "F");
  
  doc.setFillColor(37, 99, 235); // Ligne d'accentuation Bleue
  doc.rect(0, 23, 297, 1, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${activeRoom.name.toUpperCase()}`, 14, 10);
  
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 16);

  // --- CONFIGURATION DE LA STRUCTURE DES DONNÉES ---
  const headers = ["ALLÉE", ...activeRoom.positions.map(pos => `POS ${pos}`)];
  
  // Tableau pour stocker le nombre maximum de palox par position (colonne)
  // Index 0 = Colonne "ALLÉE"
  const maxPaloxPerColumn = new Array(headers.length).fill(0);

  const body = activeRoom.zones.map(zone => {
    const rowCells = [zone];
    activeRoom.positions.forEach((pos, index) => {
      const colIndex = index + 1; // Décale de 1 car l'index 0 est l'allée
      const locCode = `${zone}${pos}`;
      const locPaloxList = currentRoomStockGrouped[locCode] || [];

      if (locPaloxList.length === 0) {
        rowCells.push("VIDE");
      } else {
        const groupedMap = {};
        locPaloxList.forEach(item => {
          const key = `${item.productId}_${item.caliber}`;
          if (!groupedMap[key]) {
            groupedMap[key] = {
              ...item,
              count: 1,
              totalWeight: item.weight
            };
          } else {
            groupedMap[key].count += 1;
            groupedMap[key].totalWeight += item.weight;
          }
        });

        const uniquePaloxLines = Object.values(groupedMap);
        // On enregistre le pic d'occupation pour cette colonne précise
        if (uniquePaloxLines.length > maxPaloxPerColumn[colIndex]) {
          maxPaloxPerColumn[colIndex] = uniquePaloxLines.length;
        }

        rowCells.push({ paloxData: uniquePaloxLines, isPaloxContainer: true });
      }
    });
    return rowCells;
  });

  // --- CALCUL DYNAMIQUE ET PROPORTIONNEL DE LA LARGEUR DES COLONNES ---
const marginX = 14 * 2;
const firstColumnWidth = 16;
const totalAvailableWidth = 297 - marginX - firstColumnWidth;// Espace pour les POS

  // Attribution de poids : une colonne vide vaut 1, une colonne avec des palox prend du poids bonus
  const colWeights = maxPaloxPerColumn.map((maxCount, idx) => {
    if (idx === 0) return 0; // Géré à part
    return maxCount === 0 ? 1.0 : 1.0 + (maxCount * 0.6); // Donne plus de poids horizontal si chargée
  });

  const totalWeight = colWeights.reduce((acc, w) => acc + w, 0);
const equalWidth = totalAvailableWidth / activeRoom.positions.length;
  // Construction dynamique de columnStyles
  const columnStyles = {
  0: { 
    fontStyle: "bold", 
    fillColor: [15, 23, 42], 
    textColor: [56, 189, 248], 
    fontSize: 10,
    halign: "center", 
    valign: "middle",
    cellWidth: firstColumnWidth 
  }
};

// Application de la largeur fixe à chaque position
activeRoom.positions.forEach((_, index) => {
  columnStyles[index + 1] = { cellWidth: equalWidth };
});

  // Répartition de la largeur selon le niveau de remplissage maximal de la colonne
  activeRoom.positions.forEach((_, index) => {
    const colIndex = index + 1;
    const calculatedWidth = (colWeights[colIndex] / totalWeight) * totalAvailableWidth;
    columnStyles[colIndex] = { cellWidth: calculatedWidth };
  });

  // --- GÉNÉRATION DE LA GRILLE PROFESSIONNELLE ---
  doc.autoTable({
    didParseCell: function (data) {
  // On cible uniquement les lignes du corps du tableau
  if (data.row.section === 'body') {
    const cellRaw = data.cell.raw;
    
    // Si la cellule contient des palox, on calcule la hauteur nécessaire
    if (cellRaw && cellRaw.isPaloxContainer && cellRaw.paloxData) {
      // 10.5 est la hauteur par item définie dans votre rendu didDrawCell
      const requiredHeight = 8 + (cellRaw.paloxData.length * 10.5); 
      
      // Si cette hauteur est supérieure à la hauteur actuelle de la ligne, on l'ajuste
      if (requiredHeight > data.row.height) {
        data.row.height = requiredHeight;
      }
    }
  }
},
    startY: 30,
    margin: { left: 14, right: 14 },
    head: [headers],
    body: body,
    theme: "grid",
    headStyles: { 
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255], 
      fontStyle: "bold", 
      halign: "center", 
      valign: "middle",
      fontSize: 8.5,
      cellPadding: 3
    },
    styles: { 
      fontSize: 8, 
      cellPadding: 2, 
      lineColor: [203, 213, 225], 
      minCellHeight: 24 
    },
    columnStyles: columnStyles, 
    
    willDrawCell: function(data) {
      if (data.row.section === "body" && data.column.index > 0) {
        const cellRaw = data.cell.raw;
        if (cellRaw && cellRaw.isPaloxContainer && cellRaw.paloxData) {
          const requiredHeight = 4 + (cellRaw.paloxData.length * 10.5);
          if (requiredHeight > data.row.height) {
            data.row.height = requiredHeight;
          }
        }
      }
    },
    didDrawCell: function(data) {
      if (data.row.section !== "body" || data.column.index === 0) return;

      const cellRaw = data.cell.raw;

      if (cellRaw === "VIDE") {
        doc.setFillColor(250, 251, 252);
        doc.rect(data.cell.x + 0.2, data.cell.y + 0.2, data.cell.width - 0.4, data.cell.height - 0.4, "F");
        doc.setTextColor(194, 204, 215);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(7.5);
        doc.text("Vide", data.cell.x + (data.cell.width / 2), data.cell.y + (data.cell.height / 2), { align: "center", valign: "middle" });
        return;
      }

      if (cellRaw && cellRaw.isPaloxContainer) {
        let currentY = data.cell.y + 2;
        const cellWidth = data.cell.width - 4;

        cellRaw.paloxData.forEach((item) => {
          let colorRGB = [148, 163, 184]; 
          if (item.productDetails.color === "#ef4444") colorRGB = [239, 68, 68];   
          if (item.productDetails.color === "#eab308") colorRGB = [234, 179, 8];    
          if (item.productDetails.color === "#22c55e") colorRGB = [34, 197, 94];    
          if (item.productDetails.color === "#f43f5e") colorRGB = [244, 63, 94];    

          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.rect(data.cell.x + 2, currentY, cellWidth, 9.5, "FD");

          doc.setFillColor(colorRGB[0], colorRGB[1], colorRGB[2]);
          doc.rect(data.cell.x + 2, currentY, 1.2, 9.5, "F");

          // Nombre de palox (ex: 2x)
          doc.setTextColor(37, 99, 235);
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(8);
          doc.text(`${item.count}x`, data.cell.x + 4, currentY + 3.8);

          // Nom du produit adapté à l'espace réel de la cellule
          doc.setTextColor(15, 23, 42);
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(7.5);
          const productName = item.productDetails.short || item.productDetails.name;
          
          // Découpe le texte proprement si la cellule est devenue très petite
          const textDetails = doc.getTextDimensions(productName, { fontSize: 7.5 });
          const allowedTextWidth = cellWidth - 17; 
          const cleanName = textDetails.w > allowedTextWidth ? productName.substring(0, 5) + "." : productName;
          doc.text(cleanName, data.cell.x + 9, currentY + 3.8);

         
          // Poids sur la ligne du bas
          doc.setTextColor(51, 65, 85);
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(7);
          // doc.text(`C: ${item.caliber}    ${item.totalWeight || item.weight} kg`, data.cell.x + 4, currentY + 7.5);
          doc.text(`${item.caliber}    `, data.cell.x + 4, currentY + 7.5);

          currentY += 10.5; 
        });
      }
    }
  });

  const fileName = `Rapport_Cartographie_2D_${activeRoom.name.trim().replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
 

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h3><LayoutGrid size={20} /> Cartographie Dynamique : {activeRoom.name}</h3>
          <div className="actions">
            <ActionButton variant="success" onClick={exportToPDF}>
              <FileText size={15} /> Exporter Rapport PDF
            </ActionButton>
            <X size={22} style={{ cursor: "pointer", color: "#64748b" }} onClick={onClose} />
          </div>
        </ModalHeader>

        <p style={{ fontSize: "13px", color: "#64748b", marginTop: 0, marginBottom: "20px" }}>
          Représentation spatiale des volumes stockés. Utilisez le bouton d'export pour obtenir le manifeste d'inventaire physique.
        </p>

        <MapScrollWrapper>
          <GridStructure cols={activeRoom.positions.length}>
            <CellHeader>ZONE</CellHeader>
            {activeRoom.positions.map(pos => (
              <CellHeader key={pos}>POS {pos}</CellHeader>
            ))}
            <CellHeader>LOGISTIQUE</CellHeader>

            {activeRoom.zones.map((zone, zIdx) => {
              const isLastRow = zIdx === activeRoom.zones.length - 1;
              return (
                <React.Fragment key={zone}>
                  <CellHeader style={{ background: "#0f172a", color: "#38bdf8", fontWeight: "800" }}>
                    {zone}
                  </CellHeader>

                  {activeRoom.positions.map(pos => {
                    const locCode = `${zone}${pos}`;
                    const items = currentRoomStockGrouped[locCode] || [];

                    return (
                      <GridCell key={locCode} hasStock={items.length > 0}>
                        <CellLabel>{locCode}</CellLabel>
                        {items.length === 0 ? (
                          <EmptyIndicator>Libre</EmptyIndicator>
                        ) : (
                          items.map(item => (
                            <MiniPalox key={item.id} color={item.productDetails?.color}>
                              <div className="title">
                                {item.productDetails?.icon} {item.barcode}
                              </div>
                              <div className="details">
                                {item.productDetails?.short} | {item.caliber}
                              </div>
                            </MiniPalox>
                          ))
                        )}
                      </GridCell>
                    );
                  })}

                  {isLastRow ? <DoorBlock>🚪 ACCÈS</DoorBlock> : <GridCell style={{ border: "none" }} />}
                </React.Fragment>
              );
            })}
          </GridStructure>
        </MapScrollWrapper>
      </ModalContent>
    </ModalOverlay>
  );
}
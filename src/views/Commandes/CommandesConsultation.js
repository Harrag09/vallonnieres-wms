// ======================================================
// COMPOSANT DE CONSULTATION & EXPORT PDF (CommandesConsultation.js)
// Design Moderne & Tableaux Matriciels Dynamiques
// ======================================================
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Url } from "Service/CategoriesServer";
import { 
  ClipboardList, Package, Layers, Calendar, 
  FileText, ArrowDownToLine, Info 
} from "lucide-react";
import ReactLoading from 'react-loading';
import jsPDF from "jspdf";
import "jspdf-autotable";

// --- STYLED COMPONENTS ---
const AppWrapper = styled.div`
  max-width: 1240px;
  margin: 32px auto;
  padding: 50px 16px 0px 16px;
  font-family: 'Inter', -apple-system, sans-serif;
`;

const MainCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 40px;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
`;

const HeaderFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 24px;

  @media(min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }

  h2 {
    font-size: 24px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;

    svg {
      color: #2563eb;
      background: #eff6ff;
      padding: 10px;
      border-radius: 12px;
      box-sizing: content-box;
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  background: #f8fafc;
  padding: 18px 24px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;

  label {
    font-size: 13px;
    font-weight: 700;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input[type="date"] {
    padding: 10px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 14px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    outline: none;

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }
`;

const ActionButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);

  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

const SectionTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin: 36px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 10px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
`;

const MatrixTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 13.5px;

  th, td {
    padding: 14px 18px;
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #f8fafc;
  }

  th {
    background: #f8fafc;
    color: #475569;
    font-weight: 700;
    white-space: nowrap;
  }

  td:first-child, th:first-child {
    text-align: left;
    font-weight: 600;
    color: #0f172a;
    background: #ffffff;
    position: sticky;
    left: 0;
    z-index: 10;
    border-right: 2px solid #e2e8f0;
  }

  tr:hover td {
    background: #fcfcfc;
  }
`;

const BadgeQty = styled.span`
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  padding: 5px 12px;
  border-radius: 8px;
  font-weight: 700;
  display: inline-block;
`;

const EmptyMessage = styled.div`
  color: #64748b;
  font-size: 14px;
  padding: 32px;
  background: #f8fafc;
  border-radius: 14px;
  text-align: center;
  border: 1px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
`;

export default function CommandesConsultation() {
  const [loading, setLoading] = useState(true);
  const [magasins, setMagasins] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        const response = await axios.get(`${Url}/commande/getOrdersConsultation`);
        if (response.data.success) {
          setMagasins(response.data.data.magasins || []);
          setProducts(response.data.data.products || []);
          setOrders(response.data.data.orders || []);
        }
      } catch (err) {
        console.error("Erreur de chargement des données de consultation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultationData();
  }, []);

  const ordersForDate = orders.filter(order => {
    if (!order.createdAt) return false;
    const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
    return orderDateStr === selectedDate;
  });

  const getQuantity = (magasinId, productId, packagingType) => {
    let total = 0;
    ordersForDate.forEach(order => {
      if (String(order.magasinId) === String(magasinId) && order.items) {
        order.items.forEach(item => {
          const isSameProduct = String(item.productId) === String(productId);
          const isSamePackaging = item.packaging?.toUpperCase() === packagingType.toUpperCase();
          if (isSameProduct && isSamePackaging) {
            total += Number(item.quantity) || 0;
          }
        });
      }
    });
    return total;
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    let isFirstPage = true;

    packagingTypes.forEach(pkg => {
      const activeMagasinsForPkg = magasins.filter(mag => {
        return products.some(prod => getQuantity(mag._id, prod._id, pkg.key) > 0);
      });

      const activeProductsForPkg = products.filter(prod => {
        return activeMagasinsForPkg.some(mag => getQuantity(mag._id, prod._id, pkg.key) > 0);
      });

      if (activeMagasinsForPkg.length === 0 || activeProductsForPkg.length === 0) {
        return;
      }

      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;

      // En-tête professionnel du PDF
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 297, 26, "F");
      
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 25, 297, 1.5, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(15);
      doc.text(`RAPPORT DE COMMANDES — ${pkg.label.toUpperCase()}`, 14, 11);
      
      doc.setTextColor(148, 163, 184);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Date ciblée : ${selectedDate.split('-').reverse().join('/')}  |  Édité le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 18);

      const headers = ["Magasin / Modèle de Caisse", ...activeProductsForPkg.map(p => p.name)];
      
      const body = activeMagasinsForPkg.map(mag => {
        const rowData = [`${mag.name} (${mag.caisse || 'Standard'})`];
        activeProductsForPkg.forEach(prod => {
          const qty = getQuantity(mag._id, prod._id, pkg.key);
          rowData.push(qty > 0 ? String(qty) : "-");
        });
        return rowData;
      });

      doc.autoTable({
        startY: 34,
        margin: { left: 14, right: 14 },
        head: [headers],
        body: body,
        theme: "grid",
        headStyles: { 
          fillColor: [30, 41, 59], 
          textColor: [255, 255, 255], 
          fontStyle: "bold", 
          halign: "center", 
          valign: "middle",
          fontSize: 9.5,
          cellPadding: 4.5
        },
        styles: { 
          fontSize: 9, 
          cellPadding: 4, 
          halign: "center",
          valign: "middle",
          lineColor: [203, 213, 225] 
        },
        columnStyles: { 
          0: { 
            halign: "left", 
            fontStyle: "bold", 
            textColor: [15, 23, 42], 
            fillColor: [248, 250, 252],
            cellWidth: 70
          } 
        }
      });
    });

    const fileName = `Rapport_Commandes_${selectedDate}.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <AppWrapper style={{ display: "flex", justifyContent: "center", padding: "120px" }}>
        <ReactLoading type={'spin'} color={'#2563eb'} height={45} width={45} />
      </AppWrapper>
    );
  }

  const packagingTypes = [
    { key: "CAISSE", label: "Tableau des Caisses", icon: <Package size={20} color="#2563eb" /> },
    { key: "SAC", label: "Tableau des Sacs", icon: <Layers size={20} color="#10b981" /> },
    { key: "PALOX", label: "Tableau des Palox", icon: <ClipboardList size={20} color="#f59e0b" /> }
  ];

  const hasAnyOrderToday = ordersForDate.length > 0;

  return (
    <AppWrapper>
      <MainCard>
        <HeaderFlex>
          <h2>
            <ClipboardList size={28} /> Consultation Globale des Commandes
          </h2>
          {hasAnyOrderToday && (
            <ActionButton onClick={exportToPDF}>
              <ArrowDownToLine size={18} /> Télécharger le Rapport PDF (Multi-pages)
            </ActionButton>
          )}
        </HeaderFlex>

        <FilterBar>
          <label>
            <Calendar size={18} color="#2563eb" /> Filtrer par jour :
          </label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
        </FilterBar>

        {!hasAnyOrderToday ? (
          <EmptyMessage>
            <Info size={20} color="#64748b" />
            Aucune commande n'a été enregistrée pour la date du {selectedDate.split('-').reverse().join('/')}.
          </EmptyMessage>
        ) : (
          packagingTypes.map(pkg => {
            const activeMagasinsForPkg = magasins.filter(mag => {
              return products.some(prod => getQuantity(mag._id, prod._id, pkg.key) > 0);
            });

            const activeProductsForPkg = products.filter(prod => {
              return activeMagasinsForPkg.some(mag => getQuantity(mag._id, prod._id, pkg.key) > 0);
            });

            if (activeMagasinsForPkg.length === 0 || activeProductsForPkg.length === 0) {
              return null;
            }

            return (
              <div key={pkg.key}>
                <SectionTitle>
                  {pkg.icon} {pkg.label}
                </SectionTitle>

                <TableWrapper>
                  <MatrixTable>
                    <thead>
                      <tr>
                        <th>Magasin \ Produits</th>
                        {activeProductsForPkg.map(prod => (
                          <th key={prod._id}>
                            {prod.icon || "🍎"} {prod.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeMagasinsForPkg.map(mag => (
                        <tr key={mag._id}>
                          <td>
                            {mag.name} <br />
                            <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "normal" }}>
                              Caisse : {mag.caisse || "Standard"}
                            </span>
                          </td>
                          {activeProductsForPkg.map(prod => {
                            const qty = getQuantity(mag._id, prod._id, pkg.key);
                            return (
                              <td key={prod._id}>
                                {qty > 0 ? (
                                  <BadgeQty>{qty}</BadgeQty>
                                ) : (
                                  <span style={{ color: "#cbd5e1" }}>-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </MatrixTable>
                </TableWrapper>
              </div>
            );
          })
        )}
      </MainCard>
    </AppWrapper>
  );
}
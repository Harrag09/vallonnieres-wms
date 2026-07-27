import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import StockService from "Service/StockService";
import { getFillLevelColor } from "views/Stock/data";

import {
    Search, Download, Package, Scale, Warehouse,
    Thermometer, Calendar, Activity, BarChart2, List,
    Droplets, Zap, RotateCcw, Tag, Layers,
    Sparkles, ArrowUpRight, Sliders, Wind,
    CheckCircle2, AlertTriangle, ShieldCheck, Grid
} from "lucide-react";

import ReactLoading from "react-loading";

import {
    ResponsiveContainer, BarChart, Bar, PieChart, Pie,
    Cell, Tooltip as RechartsTooltip, CartesianGrid,
    XAxis, YAxis
} from "recharts";

// ======================================================
// THEME & COLOR SYSTEM
// ======================================================

const THEME = {
    primary: "#6366F1",
    primaryLight: "#EEF2FF",
    primaryHover: "#4F46E5",
    secondary: "#0EA5E9",
    secondaryLight: "#F0F9FF",
    success: "#10B981",
    successLight: "#ECFDF5",
    warning: "#F59E0B",
    warningLight: "#FFFBEB",
    danger: "#EF4444",
    purple: "#8B5CF6",
    purpleLight: "#F5F3FF",
    dark: "#0F172A",
    cardBg: "#FFFFFF",
    bg: "#F8FAFC",
    text: "#334155",
    textMuted: "#64748B",
    border: "#E2E8F0",
    shadowSm: "0 1px 3px rgba(0,0,0,0.05)",
    shadowMd: "0 10px 25px -5px rgba(99, 102, 241, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
    shadowLg: "0 20px 30px -10px rgba(15, 23, 42, 0.08)"
};

const CHART_COLORS = ["#6366F1", "#0EA5E9", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#EF4444"];

// ======================================================
// STYLED COMPONENTS
// ======================================================

const Container = styled.div`
    min-height: 100vh;
    background: ${THEME.bg};
    padding: 32px 40px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: ${THEME.dark};

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 16px;

    .title-group {
        h1 {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            color: ${THEME.dark};
            letter-spacing: -0.8px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        p {
            margin: 6px 0 0 0;
            color: ${THEME.textMuted};
            font-size: 14px;
        }
    }
`;

const FilterCard = styled(motion.div)`
    background: ${THEME.cardBg};
    border-radius: 20px;
    padding: 24px;
    border: 1px solid ${THEME.border};
    box-shadow: ${THEME.shadowSm};
    margin-bottom: 28px;

    .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;

        .title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 800;
            font-size: 13px;
            color: ${THEME.dark};
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }
    }
`;

const FilterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 14px;
    align-items: flex-end;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
        font-size: 11px;
        font-weight: 700;
        color: ${THEME.textMuted};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    input, select {
        width: 100%;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid ${THEME.border};
        background: #F8FAFC;
        font-size: 13px;
        font-weight: 600;
        color: ${THEME.dark};
        outline: none;
        transition: all 0.2s ease;

        &:focus {
            background: #FFF;
            border-color: ${THEME.primary};
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
    }
`;

const CalibrePillGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;

    .chip-label {
        font-size: 12px;
        font-weight: 700;
        color: ${THEME.textMuted};
        margin-right: 4px;
    }
`;

const CalibreChip = styled.button`
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid ${props => props.active ? THEME.primary : THEME.border};
    background: ${props => props.active ? THEME.primary : "#F8FAFC"};
    color: ${props => props.active ? "#FFF" : THEME.text};
    transition: all 0.2s ease;

    &:hover {
        border-color: ${THEME.primary};
        color: ${props => props.active ? "#FFF" : THEME.primary};
    }
`;

const Button = styled(motion.button)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &.primary {
        background: ${THEME.primary};
        color: #FFF;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
        &:hover { background: ${THEME.primaryHover}; }
    }

    &.secondary {
        background: #F1F5F9;
        color: ${THEME.text};
        border: 1px solid ${THEME.border};
        &:hover { background: #E2E8F0; }
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 20px;
    margin-bottom: 28px;
`;

const StatCard = styled(motion.div)`
    background: ${THEME.cardBg};
    padding: 22px;
    border-radius: 20px;
    border: 1px solid ${THEME.border};
    box-shadow: ${THEME.shadowSm};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .info {
        .label {
            font-size: 12px;
            font-weight: 700;
            color: ${THEME.textMuted};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .value {
            font-size: 28px;
            font-weight: 800;
            color: ${THEME.dark};
            margin: 6px 0 4px 0;
        }
        .sub {
            font-size: 12px;
            font-weight: 600;
            color: ${THEME.success};
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

    .icon-box {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${props => props.bg || THEME.primaryLight};
        color: ${props => props.color || THEME.primary};
    }
`;

const GridTwoCols = styled.div`
    display: grid;
    grid-template-columns: 1.6fr 1.1fr;
    gap: 24px;
    margin-bottom: 28px;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const Panel = styled.div`
    background: ${THEME.cardBg};
    border-radius: 20px;
    padding: 24px;
    border: 1px solid ${THEME.border};
    box-shadow: ${THEME.shadowSm};

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h3 {
            font-size: 16px;
            font-weight: 800;
            color: ${THEME.dark};
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        span {
            font-size: 12px;
            color: ${THEME.textMuted};
            font-weight: 600;
        }
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    th {
        text-align: left;
        padding: 14px 18px;
        background: #F8FAFC;
        color: ${THEME.textMuted};
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        border-bottom: 1px solid ${THEME.border};
    }

    td {
        padding: 16px 18px;
        border-bottom: 1px solid ${THEME.border};
        font-size: 13px;
        font-weight: 600;
        color: ${THEME.dark};
    }

    tr:hover td { background: #F8FAFC; }
`;

const TabNav = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    border-bottom: 2px solid ${THEME.border};
    padding-bottom: 4px;
`;

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.active ? THEME.primary : THEME.textMuted};
    border-bottom: 3px solid ${props => props.active ? THEME.primary : "transparent"};
    cursor: pointer;
    margin-bottom: -6px;
    transition: all 0.2s ease;

    &:hover { color: ${THEME.primary}; }
`;

// Helper for dynamic threshold colors (<5 Red, <10 Yellow, <15 Blue, else Green)
const getPaloxCountStyle = (count) => {
    if (count < 5) {
        return { background: "#FEE2E2", color: "#DC2626", label: "< 5 (Rouge)" };
    }
    if (count < 10) {
        return { background: "#FEF3C7", color: "#D97706", label: "< 10 (Jaune)" };
    }
    if (count < 15) {
        return { background: "#E0F2FE", color: "#0284C7", label: "< 15 (Bleu)" };
    }
    return { background: "#DCFCE7", color: "#16A34A", label: "15+ (Vert)" };
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function Statistique() {
    const [activeTab, setActiveTab] = useState("overview");

    // FILTERS
    const [globalSearch, setGlobalSearch] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [caliberSearch, setCaliberSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // DATA STATE
    const [isLoading, setIsLoading] = useState(true);
    const [paloxList, setPaloxList] = useState([]);
    const [roomsList, setRoomsList] = useState([]);
    const [productList, setProductList] = useState([]);

    // Fetch statistics
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                search: globalSearch,
                product: productSearch,
                room: selectedRoom,
                caliber: caliberSearch,
                startDate,
                endDate
            };

            const res = await StockService.getStatistics(params);
            if (res && res.success) {
                let filtered = res.data.palox || [];

                if (productSearch.trim() !== "") {
                    const q = productSearch.toLowerCase().trim();
                    filtered = filtered.filter(p => p.productDetails?.name?.toLowerCase().includes(q));
                }

                if (selectedRoom) {
                    filtered = filtered.filter(p => p.coldRoomId === selectedRoom || p.roomDetails?._id === selectedRoom);
                }

                if (caliberSearch.trim() !== "") {
                    filtered = filtered.filter(p => String(p.caliber || "").toLowerCase() === caliberSearch.toLowerCase());
                }

                setPaloxList(filtered);
                setRoomsList(res.data.rooms || []);

                const products = Array.from(new Set((res.data.palox || []).map(p => p.productDetails?.name).filter(Boolean)));
                setProductList(products);
            }
        } catch (error) {
            console.error("Error loading stats:", error);
        } finally {
            setIsLoading(false);
        }
    }, [globalSearch, productSearch, selectedRoom, caliberSearch, startDate, endDate]);

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 250);
        return () => clearTimeout(timer);
    }, [fetchData]);

    // Available Calibers Extraction
    const availableCalibers = useMemo(() => {
        const set = new Set();
        paloxList.forEach(p => { if (p.caliber) set.add(String(p.caliber)); });
        return Array.from(set).sort();
    }, [paloxList]);

    const handleResetFilters = () => {
        setGlobalSearch("");
        setProductSearch("");
        setSelectedRoom("");
        setCaliberSearch("");
        setStartDate("");
        setEndDate("");
    };

    const handleExportCSV = () => {
        if (!paloxList.length) return;
        const headers = ["ID", "Code-Barres", "Produit", "Chambre", "Calibre", "Remplissage", "Poids (kg)"];
        const rows = paloxList.map(p => [
            p._id,
            p.barcode || "-",
            p.productDetails?.name || "Inconnu",
            p.roomDetails?.name || "N/A",
            p.caliber || "-",
            p.fillLevel || "N/A",
            p.weight || 0
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Analyse_Stock_Calibres_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    // Analytics Computations & Breakdown
    const analytics = useMemo(() => {
        const totalWeight = paloxList.reduce((sum, p) => sum + (Number(p.weight) || 0), 0);
        const totalCount = paloxList.length;
        const avgWeight = totalCount > 0 ? (totalWeight / totalCount).toFixed(1) : 0;

        // Variety breakdown
        const productMap = {};
        paloxList.forEach(p => {
            const name = p.productDetails?.name || "Autre";
            if (!productMap[name]) productMap[name] = { name, count: 0, weight: 0 };
            productMap[name].count += 1;
            productMap[name].weight += (Number(p.weight) || 0);
        });

        const productStats = Object.values(productMap).map((prod, index) => ({
            ...prod,
            color: CHART_COLORS[index % CHART_COLORS.length]
        }));

        // Room breakdown
        const roomMap = {};
        roomsList.forEach(r => { roomMap[r.name] = 0; });
        paloxList.forEach(p => {
            const roomName = p.roomDetails?.name || "Non assigné";
            roomMap[roomName] = (roomMap[roomName] || 0) + (Number(p.weight) || 0);
        });

        const roomStats = Object.keys(roomMap).map(name => ({ name, weight: roomMap[name] }));

        // Product by Caliber Breakdown (Stacked Bar Chart Dataset for Dashboard)
        const productCaliberMap = {};
        const calibersSet = new Set();

        paloxList.forEach(p => {
            const prodName = p.productDetails?.name || "Autre";
            const cal = p.caliber ? String(p.caliber) : "N/A";
            calibersSet.add(cal);

            if (!productCaliberMap[prodName]) {
                productCaliberMap[prodName] = { name: prodName };
            }
            productCaliberMap[prodName][cal] = (productCaliberMap[prodName][cal] || 0) + (Number(p.weight) || 0);
        });

        const productCaliberStats = Object.values(productCaliberMap);
        const activeCalibers = Array.from(calibersSet).sort();

        // Product x Calibre Matrix Rows for Matrix Tab
        const matrixMap = {};
        paloxList.forEach(p => {
            const prodName = p.productDetails?.name || "Autre";
            const cal = p.caliber ? String(p.caliber) : "N/A";
            const key = `${prodName}_${cal}`;
            if (!matrixMap[key]) {
                matrixMap[key] = {
                    product: prodName,
                    caliber: cal,
                    paloxCount: 0,
                    totalWeight: 0
                };
            }
            matrixMap[key].paloxCount += 1;
            matrixMap[key].totalWeight += (Number(p.weight) || 0);
        });

        const caliberMatrixRows = Object.values(matrixMap).sort((a, b) => b.paloxCount - a.paloxCount);

        return { totalWeight, totalCount, avgWeight, productStats, roomStats, productCaliberStats, activeCalibers, caliberMatrixRows };
    }, [paloxList, roomsList]);

    return (
        <Container>
            {/* HEADER */}
            <Header>
                <div className="title-group">
                    <h1><Sparkles size={28} color={THEME.primary} /> Tableau de Bord Analytique</h1>
                    <p>Pilotage intelligent du stock, suivi de volume et filtrage par calibre</p>
                </div>
                <Button className="primary" onClick={handleExportCSV} whileHover={{ scale: 1.02 }}>
                    <Download size={16} /> Exporter Rapport CSV
                </Button>
            </Header>

            {/* ADVANCED FILTER SYSTEM */}
            <FilterCard initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="filter-header">
                    <div className="title">
                        <Sliders size={16} color={THEME.primary} /> Filtres Dynamiques de Recherche
                    </div>
                    <Button className="secondary" onClick={handleResetFilters}>
                        <RotateCcw size={14} /> Réinitialiser
                    </Button>
                </div>

                <FilterGrid>
                    <FormGroup>
                        <label><Search size={12} /> Recherche globale</label>
                        <input 
                            type="text" 
                            placeholder="Code-barres, ID..." 
                            value={globalSearch} 
                            onChange={(e) => setGlobalSearch(e.target.value)} 
                        />
                    </FormGroup>

                    <FormGroup>
                        <label><Tag size={12} /> Produit / Variété</label>
                        <input 
                            type="text" 
                            list="products-datalist"
                            placeholder="Gala, Golden..." 
                            value={productSearch} 
                            onChange={(e) => setProductSearch(e.target.value)} 
                        />
                        <datalist id="products-datalist">
                            {productList.map((prod, i) => <option key={i} value={prod} />)}
                        </datalist>
                    </FormGroup>

                    {/* SELECTEUR CALIBRE */}
                    <FormGroup>
                        <label><Layers size={12} /> Calibre Spécifique</label>
                        <select value={caliberSearch} onChange={(e) => setCaliberSearch(e.target.value)}>
                            <option value="">Tous les calibres</option>
                            {availableCalibers.map((cal, idx) => (
                                <option key={idx} value={cal}>Calibre {cal}</option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormGroup>
                        <label><Warehouse size={12} /> Chambre Froide</label>
                        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                            <option value="">Toutes les chambres</option>
                            {roomsList.map(r => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormGroup>
                        <label><Calendar size={12} /> Date Début</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </FormGroup>

                    <FormGroup>
                        <label><Calendar size={12} /> Date Fin</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </FormGroup>
                </FilterGrid>

                {/* QUICK CALIBRE CHIPS */}
                {availableCalibers.length > 0 && (
                    <CalibrePillGroup>
                        <span className="chip-label">Sélecteur rapide de Calibre :</span>
                        <CalibreChip 
                            active={caliberSearch === ""} 
                            onClick={() => setCaliberSearch("")}
                        >
                            Tous ({paloxList.length})
                        </CalibreChip>
                        {availableCalibers.map((cal, i) => (
                            <CalibreChip 
                                key={i} 
                                active={caliberSearch === cal} 
                                onClick={() => setCaliberSearch(cal)}
                            >
                                Calibre {cal}
                            </CalibreChip>
                        ))}
                    </CalibrePillGroup>
                )}
            </FilterCard>

            {/* NAVIGATION TABS */}
            <TabNav>
                <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                    <BarChart2 size={16} /> Dashboard Analytics
                </TabButton>
                <TabButton active={activeTab === "matrix"} onClick={() => setActiveTab("matrix")}>
                    <Grid size={16} /> Matrice Calibres & Seuils
                </TabButton>
                <TabButton active={activeTab === "iot"} onClick={() => setActiveTab("iot")}>
                    <Zap size={16} /> Telemétrie IoT
                </TabButton>
                <TabButton active={activeTab === "table"} onClick={() => setActiveTab("table")}>
                    <List size={16} /> Registre Palox ({paloxList.length})
                </TabButton>
            </TabNav>

            {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                    <ReactLoading type="spinningBubbles" color={THEME.primary} height={60} width={60} />
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {/* TAB 1: OVERVIEW (DASHBOARD WITH OLD CHARTS + STACKED PRODUCT/CALIBRE) */}
                    {activeTab === "overview" && (
                        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* KPIS */}
                            <StatsGrid>
                                <StatCard bg={THEME.primaryLight} color={THEME.primary} whileHover={{ y: -3 }}>
                                    <div className="info">
                                        <div className="label">Total Palox</div>
                                        <div className="value">{analytics.totalCount}</div>
                                        <div className="sub"><ShieldCheck size={14} /> Unités enregistrées</div>
                                    </div>
                                    <div className="icon-box"><Package size={22} /></div>
                                </StatCard>

                                <StatCard bg={THEME.successLight} color={THEME.success} whileHover={{ y: -3 }}>
                                    <div className="info">
                                        <div className="label">Tonnage Global</div>
                                        <div className="value">{(analytics.totalWeight / 1000).toFixed(2)} T</div>
                                        <div className="sub"><ArrowUpRight size={14} /> {analytics.totalWeight.toLocaleString()} kg</div>
                                    </div>
                                    <div className="icon-box" style={{ background: THEME.successLight, color: THEME.success }}><Scale size={22} /></div>
                                </StatCard>

                                <StatCard bg={THEME.secondaryLight} color={THEME.secondary} whileHover={{ y: -3 }}>
                                    <div className="info">
                                        <div className="label">Poids Moyen / Palox</div>
                                        <div className="value">{analytics.avgWeight} kg</div>
                                        <div className="sub"><CheckCircle2 size={14} /> Charge optimale</div>
                                    </div>
                                    <div className="icon-box" style={{ background: THEME.secondaryLight, color: THEME.secondary }}><Layers size={22} /></div>
                                </StatCard>

                                <StatCard bg={THEME.purpleLight} color={THEME.purple} whileHover={{ y: -3 }}>
                                    <div className="info">
                                        <div className="label">Variétés Distinctes</div>
                                        <div className="value">{analytics.productStats.length}</div>
                                        <div className="sub"><Tag size={14} /> Actives en stock</div>
                                    </div>
                                    <div className="icon-box" style={{ background: THEME.purpleLight, color: THEME.purple }}><Activity size={22} /></div>
                                </StatCard>
                            </StatsGrid>

                            {/* CHARTS GRID */}
                            <GridTwoCols>
                                {/* MASSE PAR CHAMBRE FROIDE */}
                                <Panel>
                                    <div className="panel-head">
                                        <h3><Warehouse size={18} color={THEME.primary} /> Masse par Chambre Froide (kg)</h3>
                                        <span>Volume global stocké</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={analytics.roomStats}>
                                            <defs>
                                                <linearGradient id="barRoomGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.7} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.border} />
                                            <XAxis dataKey="name" stroke={THEME.textMuted} tickLine={false} />
                                            <YAxis stroke={THEME.textMuted} axisLine={false} tickLine={false} />
                                            <RechartsTooltip 
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div style={{ background: THEME.dark, color: "#FFF", padding: "10px 14px", borderRadius: "10px", fontSize: "12px" }}>
                                                                <strong>{data.name}</strong>
                                                                <div style={{ color: "#38BDF8", marginTop: 4 }}>⚖️ {data.weight.toLocaleString()} kg</div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar dataKey="weight" fill="url(#barRoomGrad)" radius={[8, 8, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Panel>

                                {/* REPARTITION PAR VARIETE (DONUT CHART) */}
                                <Panel>
                                    <div className="panel-head">
                                        <h3><Tag size={18} color={THEME.secondary} /> Part de Stock par Variété</h3>
                                        <span>Proportions du tonnage total</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={analytics.productStats}
                                                dataKey="weight"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={95}
                                                paddingAngle={4}
                                            >
                                                {analytics.productStats.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip 
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const d = payload[0].payload;
                                                        return (
                                                            <div style={{ background: "#FFF", border: `1px solid ${THEME.border}`, padding: "10px 14px", borderRadius: "10px", boxShadow: THEME.shadowMd }}>
                                                                <strong style={{ color: d.color }}>{d.name}</strong>
                                                                <div style={{ fontSize: 12, marginTop: 4 }}>📦 {d.count} Palox ({d.weight} kg)</div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Panel>
                            </GridTwoCols>

                            {/* OLD DASHBOARD CHART: MASSE PAR PRODUIT & CALIBRE */}
                            <Panel style={{ marginBottom: 28 }}>
                                <div className="panel-head">
                                    <h3><Layers size={18} color={THEME.purple} /> Masse par Produit & Calibre (kg)</h3>
                                    <span>Répartition détaillée du poids par variété et calibre</span>
                                </div>
                                {analytics.productCaliberStats.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "30px", color: THEME.textMuted }}>
                                        Aucune donnée disponible pour les calibres.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart data={analytics.productCaliberStats}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.border} />
                                            <XAxis dataKey="name" stroke={THEME.textMuted} tickLine={false} />
                                            <YAxis stroke={THEME.textMuted} axisLine={false} tickLine={false} />
                                            <RechartsTooltip 
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div style={{ background: THEME.dark, color: "#FFF", padding: "12px 16px", borderRadius: "12px", fontSize: "12px", boxShadow: THEME.shadowMd }}>
                                                                <strong style={{ fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.2)", display: "block", paddingBottom: 4, marginBottom: 6 }}>{label}</strong>
                                                                {payload.map((entry, index) => (
                                                                    <div key={index} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 4 }}>
                                                                        <span style={{ color: entry.color }}>Calibre {entry.dataKey}:</span>
                                                                        <strong>{Number(entry.value).toLocaleString()} kg</strong>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            {analytics.activeCalibers.map((cal, index) => (
                                                <Bar 
                                                    key={cal} 
                                                    dataKey={cal} 
                                                    name={`Calibre ${cal}`} 
                                                    stackId="a" 
                                                    fill={CHART_COLORS[index % CHART_COLORS.length]} 
                                                    radius={index === analytics.activeCalibers.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                                                    barSize={38}
                                                />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Panel>
                        </motion.div>
                    )}

                    {/* TAB 2: MATRICE CALIBRES & SEUILS */}
                    {activeTab === "matrix" && (
                        <motion.div key="matrix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Panel>
                                <div className="panel-head">
                                    <h3><Layers size={18} color={THEME.primary} /> Suivi des Palox par Produit & Calibre (Seuils Couleur)</h3>
                                    <span>Légende : &lt;5 en Rouge | &lt;10 en Jaune | &lt;15 en Bleu | 15+ en Vert</span>
                                </div>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Variété / Produit</th>
                                            <th>Calibre</th>
                                            <th>Nombre de Palox</th>
                                            <th>Poids Total Cumulé</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.caliberMatrixRows.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: "center", padding: 40, color: THEME.textMuted }}>
                                                    <AlertTriangle size={24} color={THEME.warning} style={{ marginBottom: 8 }} />
                                                    <div>Aucune donnée de calibre disponible.</div>
                                                </td>
                                            </tr>
                                        ) : (
                                            analytics.caliberMatrixRows.map((row, idx) => {
                                                const styleInfo = getPaloxCountStyle(row.paloxCount);
                                                return (
                                                    <tr key={idx}>
                                                        <td>
                                                            <strong style={{ color: THEME.dark, fontSize: 14 }}>{row.product}</strong>
                                                        </td>
                                                        <td>
                                                            <span style={{ padding: "4px 12px", background: THEME.primaryLight, color: THEME.primary, borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                                                                Calibre {row.caliber}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: 6,
                                                                padding: "6px 14px",
                                                                borderRadius: "20px",
                                                                fontSize: 13,
                                                                fontWeight: 800,
                                                                background: styleInfo.background,
                                                                color: styleInfo.color
                                                            }}>
                                                                📦 {row.paloxCount} palox
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <strong style={{ fontSize: 13 }}>{row.totalWeight.toLocaleString()} kg</strong>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </Table>
                            </Panel>
                        </motion.div>
                    )}

                    {/* TAB 3: IOT TELEMETRY */}
                    {activeTab === "iot" && (
                        <motion.div key="iot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                                {roomsList.map((room) => (
                                    <Panel key={room._id}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                            <h3 style={{ margin: 0, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                                <Warehouse size={18} color={THEME.primary} /> {room.name}
                                            </h3>
                                            <span style={{ fontSize: 10, background: THEME.successLight, color: THEME.success, padding: "3px 10px", borderRadius: 12, fontWeight: 800 }}>
                                                EN SERVICE
                                            </span>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                            <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                                                <div style={{ fontSize: 11, color: THEME.textMuted, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Thermometer size={14} color={THEME.danger} /> Température
                                                </div>
                                                <strong style={{ fontSize: 22, color: THEME.dark, marginTop: 6, display: "block" }}>1.8 °C</strong>
                                            </div>
                                            <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                                                <div style={{ fontSize: 11, color: THEME.textMuted, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Droplets size={14} color={THEME.secondary} /> Humidité HR
                                                </div>
                                                <strong style={{ fontSize: 22, color: THEME.dark, marginTop: 6, display: "block" }}>92 %</strong>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px stroke ${THEME.border}`, display: "flex", justifyContent: "space-between", fontSize: 12, color: THEME.textMuted, fontWeight: 600 }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Wind size={13} /> Ventilation: 85%</span>
                                            <span style={{ color: THEME.success }}>Consigne OK</span>
                                        </div>
                                    </Panel>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 4: PALOX REGISTER */}
                    {activeTab === "table" && (
                        <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Panel style={{ padding: 0, overflow: "hidden" }}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Code-Barres / ID</th>
                                            <th>Variété / Produit</th>
                                            <th>Chambre Froide</th>
                                            <th>Calibre</th>
                                            <th>Niveau Remplissage</th>
                                            <th>Poids Net</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paloxList.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: "center", padding: 40, color: THEME.textMuted }}>
                                                    <AlertTriangle size={24} color={THEME.warning} style={{ marginBottom: 8 }} />
                                                    <div>Aucun Palox ne correspond aux filtres sélectionnés.</div>
                                                </td>
                                            </tr>
                                        ) : (
                                            paloxList.map((item) => (
                                                <tr key={item._id}>
                                                    <td><strong>{item.barcode || `#${item._id.slice(-6)}`}</strong></td>
                                                    <td><span style={{ color: THEME.primary, fontWeight: 700 }}>{item.productDetails?.name || "Non spécifié"}</span></td>
                                                    <td>{item.roomDetails?.name || "Sans chambre"}</td>
                                                    <td>
                                                        <span style={{ padding: "4px 10px", background: THEME.primaryLight, color: THEME.primary, borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                                                            {item.caliber || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            padding: "4px 10px",
                                                            borderRadius: 8,
                                                            fontSize: 11,
                                                            fontWeight: 800,
                                                            background: getFillLevelColor(item.fillLevel) + "20",
                                                            color: getFillLevelColor(item.fillLevel)
                                                        }}>
                                                            {item.fillLevel || "Inconnu"}
                                                        </span>
                                                    </td>
                                                    <td><strong>{item.weight} kg</strong></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </Panel>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </Container>
    );
}
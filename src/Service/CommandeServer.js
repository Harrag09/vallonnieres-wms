// ======================================================
// COMPOSANT DE SAISIE DES COMMANDES (CommandeServer.js)
// Gestion des états de chargement (Loading) & Erreurs
// ======================================================
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Url } from "./CategoriesServer";
import StockServise from "./StockService";
import { 
  ShoppingCart, Plus, Trash2, Send, CheckCircle2, 
  Store, X, Package, Layers, Sparkles, AlertCircle 
} from "lucide-react";
import ReactLoading from 'react-loading';

// --- STYLED COMPONENTS ---
const AppWrapper = styled.div`
  max-width: 960px;
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

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 24px;

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

  p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  select, input {
    width: 100%;
    height: 50px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    padding: 0 16px;
    font-size: 14px;
    color: #0f172a;
    font-weight: 500;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #2563eb;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }
  }
`;

const SelectRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;

  @media(max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ItemsContainer = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`;

const ItemCard = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  background: #ffffff;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media(max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button`
  background: ${props => 
    props.variant === "success" ? "#10b981" : 
    props.variant === "danger" ? "#fef2f2" : 
    props.variant === "secondary" ? "#f1f5f9" : "#2563eb"};
  
  color: ${props => 
    props.variant === "danger" ? "#ef4444" : 
    props.variant === "secondary" ? "#475569" : "#ffffff"};
  
  border: ${props => props.variant === "secondary" ? "1px solid #cbd5e1" : "none"};
  padding: 0 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  white-space: nowrap;
  height: 50px;
  opacity: ${props => props.disabled ? 0.7 : 1};
  pointer-events: ${props => props.disabled ? "none" : "auto"};

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    background: ${props => 
      props.variant === "danger" ? "#fee2e2" : 
      props.variant === "secondary" ? "#e2e8f0" : undefined};
  }

  &:active {
    transform: translateY(0);
  }
`;

const AlertBox = styled.div`
  background: ${props => props.variant === "error" ? "#fef2f2" : "#ecfdf5"};
  border: 1px solid ${props => props.variant === "error" ? "#fecaca" : "#a7f3d0"};
  padding: 16px 20px;
  border-radius: 14px;
  margin-bottom: 24px;
  font-size: 14px;
  color: ${props => props.variant === "error" ? "#991b1b" : "#065f46"};
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
`;

const MetaBadge = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 13px;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);

  h3 {
    margin-top: 0;
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }
`;

export default function CommandeServer() {
  const [loading, setLoading] = useState(true);
  const [magasins, setMagasins] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedMagasinId, setSelectedMagasinId] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  
  // États de feedback et de chargement
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour la modale et l'ajout de magasin
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreCaisse, setNewStoreCaisse] = useState("VC Gris");
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await StockServise.getAllPaloxAndAllProductAndCOLD_ROOMS();
      if (response.success) {
        const fetchedMagasins = response.data.magasin || [];
        const fetchedProducts = response.data.product || [];

        setMagasins(fetchedMagasins);
        setProducts(fetchedProducts);

        if (fetchedMagasins.length > 0 && !selectedMagasinId) {
          setSelectedMagasinId(fetchedMagasins[0]._id);
        }
        if (fetchedProducts.length > 0 && orderItems.length === 0) {
          setOrderItems([
            { productId: fetchedProducts[0]._id, quantity: 7, packaging: "CAISSE" }
          ]);
        }
      }
    } catch (err) {
      console.error("Erreur chargement données:", err);
      setErrorMsg("Impossible de charger les données initiales du serveur.");
    } finally {
      setLoading(false);
    }
  };

  const currentMagasin = magasins.find(m => m._id === selectedMagasinId);

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const addItemRow = () => {
    if (products.length > 0) {
      setOrderItems([...orderItems, { productId: products[0]._id, quantity: 1, packaging: "CAISSE" }]);
    }
  };

  const removeItemRow = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Action pour créer un nouveau magasin avec gestion du loading et des erreurs
  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!newStoreName.trim()) {
      setModalError("Veuillez entrer un nom de magasin.");
      return;
    }

    setIsCreatingStore(true);
    setModalError("");

    try {
      const res = await axios.post(`${Url}/commande/createStore`, {
        name: newStoreName.trim(),
        caisse: newStoreCaisse
      });

      if (res.data.success) {
        const createdStore = res.data.data;
        setMagasins(prev => [...prev, createdStore]);
        setSelectedMagasinId(createdStore._id);
        setIsModalOpen(false);
        setNewStoreName("");
        setNewStoreCaisse("VC Gris");
      }
    } catch (err) {
      console.error("Erreur création magasin:", err);
      setModalError(err.response?.data?.error || err.message || "Erreur lors de la création du magasin.");
    } finally {
      setIsCreatingStore(false);
    }
  };

  // Action pour soumettre la commande avec gestion du loading et des erreurs
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!selectedMagasinId) {
      setErrorMsg("Veuillez sélectionner un magasin.");
      return;
    }
    if (orderItems.length === 0) {
      setErrorMsg("Veuillez ajouter au moins un article.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      magasinId: selectedMagasinId,
      items: orderItems,
      userId: "6a5896cbdcd841dea495d174"
    };

    try {
      const res = await axios.post(`${Url}/commande/createStoreOrder`, payload);
      if (res.data.success) {
        setSuccessMsg("Commande transmise et enregistrée avec succès !");
        setTimeout(() => setSuccessMsg(""), 4000);

        // Réinitialisation par défaut des articles
        if (products.length > 0) {
          setOrderItems([
            { productId: products[0]._id, quantity: 7, packaging: "CAISSE" }
          ]);
        } else {
          setOrderItems([]);
        }
      }
    } catch (err) {
      console.error("Erreur envoi commande:", err);
      setErrorMsg(err.response?.data?.error || err.message || "Une erreur est survenue lors de l'envoi de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && magasins.length === 0) {
    return (
      <AppWrapper style={{ display: "flex", justifyContent: "center", padding: "120px" }}>
        <ReactLoading type={'spin'} color={'#2563eb'} height={45} width={45} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <MainCard>
        <HeaderSection>
          <h2>
            <ShoppingCart size={28} /> Saisie des Commandes Magasins
          </h2>
          <p>Enregistrez rapidement les besoins quotidiens des magasins partenaires.</p>
        </HeaderSection>

        {successMsg && (
          <AlertBox>
            <CheckCircle2 size={20} /> <strong>{successMsg}</strong>
          </AlertBox>
        )}

        {errorMsg && (
          <AlertBox variant="error">
            <AlertCircle size={20} /> <strong>{errorMsg}</strong>
          </AlertBox>
        )}

        <form onSubmit={handleSubmitOrder}>
          <FormGroup>
            <label>Magasin Destinataire</label>
            <SelectRow>
              <select 
                value={selectedMagasinId} 
                onChange={(e) => setSelectedMagasinId(e.target.value)}
              >
                {magasins.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name} &nbsp;—&nbsp; Caisse : {m.caisse || "Standard"}
                  </option>
                ))}
              </select>
              <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(true); setModalError(""); }}>
                <Store size={18} /> + Nouveau Magasin
              </Button>
            </SelectRow>
          </FormGroup>

          {currentMagasin && (
            <MetaBadge>
              <Sparkles size={16} color="#2563eb" />
              <span>Magasin actif : &nbsp;<strong>{currentMagasin.name}</strong></span>
              <span style={{ margin: "0 6px" }}>•</span>
              <span>Modèle de caisse : &nbsp;<strong>{currentMagasin.caisse}</strong></span>
            </MetaBadge>
          )}

          <FormGroup>
            <label>Lignes d'articles commandés</label>
            <ItemsContainer>
              {orderItems.map((item, idx) => (
                <ItemCard key={idx}>
                  <select 
                    value={item.productId} 
                    onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
                  >
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.icon || "🍎"} {p.name}
                      </option>
                    ))}
                  </select>

                  <input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))} 
                    placeholder="Quantité"
                  />

                  <select 
                    value={item.packaging} 
                    onChange={(e) => handleItemChange(idx, "packaging", e.target.value)}
                  >
                    <option value="CAISSE">CAISSE</option>
                    <option value="SAC">SAC</option>
                    <option value="PALOX">PALOX</option>
                  </select>

                  <Button type="button" variant="danger" onClick={() => removeItemRow(idx)} style={{ width: "50px", padding: 0 }}>
                    <Trash2 size={18} />
                  </Button>
                </ItemCard>
              ))}

              <Button type="button" onClick={addItemRow} variant="secondary" style={{ width: "100%", marginTop: "12px", borderStyle: "dashed" }}>
                <Plus size={18} /> Ajouter un autre article
              </Button>
            </ItemsContainer>
          </FormGroup>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}>
            <Button type="submit" variant="success" disabled={isSubmitting} style={{ padding: "0 36px", fontSize: "15px", height: "52px" }}>
              {isSubmitting ? (
                <>
                  <ReactLoading type={'spin'} color={'#ffffff'} height={20} width={20} />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Valider et Transmettre la Commande</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* MODALE D'AJOUT DE MAGASIN */}
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <h3><Store size={22} color="#2563eb" /> Ajouter un Magasin</h3>

              {modalError && (
                <AlertBox variant="error" style={{ marginBottom: "16px", padding: "10px 14px", fontSize: "13px" }}>
                  <AlertCircle size={16} /> <strong>{modalError}</strong>
                </AlertBox>
              )}

              <form onSubmit={handleCreateStore}>
                <FormGroup>
                  <label>Nom du Magasin</label>
                  <input 
                    type="text" 
                    value={newStoreName} 
                    onChange={(e) => setNewStoreName(e.target.value)} 
                    placeholder="Ex: Super U Alençon" 
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Type de Caisse</label>
                  <select 
                    value={newStoreCaisse} 
                    onChange={(e) => setNewStoreCaisse(e.target.value)}
                    required
                  >
                    <option value="VF">VF</option>
                    <option value="VC Gris">VC Gris</option>
                    <option value="Ifco">Ifco</option>
                    <option value="Standard">Standard</option>
                  </select>
                </FormGroup>

                <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
                  <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" style={{ flex: 1 }}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="success" disabled={isCreatingStore} style={{ flex: 1 }}>
                    {isCreatingStore ? (
                      <ReactLoading type={'spin'} color={'#ffffff'} height={18} width={18} />
                    ) : (
                      <>
                        <Plus size={18} /> Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainCard>
    </AppWrapper>
  );
}
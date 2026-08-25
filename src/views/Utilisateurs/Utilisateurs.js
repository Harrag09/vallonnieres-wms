import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import UserService2 from "Service/UserService2";
import { 
    Users, UserPlus, Edit3, Trash2, Shield, 
    CheckCircle2, AlertTriangle, X, Save, Search 
} from "lucide-react";
import ReactLoading from "react-loading";

const THEME = {
    primary: "#6366F1",
    primaryLight: "#EEF2FF",
    primaryHover: "#4F46E5",
    success: "#10B981",
    successLight: "#ECFDF5",
    danger: "#EF4444",
    dangerLight: "#FEE2E2",
    warning: "#F59E0B",
    dark: "#0F172A",
    cardBg: "#FFFFFF",
    bg: "#F8FAFC",
    text: "#334155",
    textMuted: "#64748B",
    border: "#E2E8F0",
    shadowSm: "0 1px 3px rgba(0,0,0,0.05)"
};

const Container = styled.div`
    min-height: 100vh;
    background: ${THEME.bg};
    padding: 32px 40px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: ${THEME.dark};
    box-sizing: border-box;
        padding-top: 80px;

    @media (max-width: 768px) {
        padding: 16px 12px;
            padding-top: 70px;

    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 16px;

    h1 {
        font-size: 24px;
        font-weight: 800;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;

const Button = styled(motion.button)`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 18px;
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
    &.danger {
        background: ${THEME.dangerLight};
        color: ${THEME.danger};
        &:hover { background: #FDC2C2; }
    }
    &.secondary {
        background: #F1F5F9;
        color: ${THEME.text};
        border: 1px solid ${THEME.border};
        &:hover { background: #E2E8F0; }
    }
`;

const Panel = styled.div`
    background: ${THEME.cardBg};
    border-radius: 20px;
    padding: 24px;
    border: 1px solid ${THEME.border};
    box-shadow: ${THEME.shadowSm};
`;

const TableWrapper = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;

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
        padding: 14px 18px;
        border-bottom: 1px solid ${THEME.border};
        font-size: 13px;
        font-weight: 600;
        color: ${THEME.dark};
    }
    tr:hover td { background: #F8FAFC; }
`;

const RoleBadge = styled.span`
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    background: ${props => {
        switch(props.role) {
            case 'admin': return '#EEF2FF';
            case 'chauffeur': return '#E0F2FE';
            case 'cariste': return '#ECFDF5';
            default: return '#FEF3C7';
        }
    }};
    color: ${props => {
        switch(props.role) {
            case 'admin': return '#6366F1';
            case 'chauffeur': return '#0284C7';
            case 'cariste': return '#10B981';
            default: return '#D97706';
        }
    }};
`;

const ModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 16px;
`;

const ModalContent = styled(motion.div)`
    background: ${THEME.cardBg};
    width: 100%;
    max-width: 500px;
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        h3 { margin: 0; font-size: 18px; font-weight: 800; }
        button { background: none; border: none; cursor: pointer; color: ${THEME.textMuted}; }
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;

    label {
        font-size: 11px;
        font-weight: 700;
        color: ${THEME.textMuted};
        text-transform: uppercase;
    }
    input, select {
        width: 100%;
        padding: 11px 14px;
        border-radius: 12px;
        border: 1px solid ${THEME.border};
        background: #F8FAFC;
        font-size: 13px;
        font-weight: 600;
        outline: none;
        &:focus { background: #FFF; border-color: ${THEME.primary}; }
    }
`;

export default function Utilisateurs() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        login: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "cariste"
    });

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await UserService2.getAllUsers();
            if (res.success) setUsers(res.data);
        } catch (error) {
            console.error("Erreur chargement utilisateurs:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                login: user.login,
                password: "", // Laisser vide pour ne pas écraser si non modifié
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({ login: "", password: "", firstName: "", lastName: "", role: "cariste" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await UserService2.updateUser(editingUser._id, formData);
            } else {
                await UserService2.createUser(formData);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert("Erreur lors de l'enregistrement : " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                await UserService2.deleteUser(id);
                fetchUsers();
            } catch (error) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    return (
        <Container>
            <Header>
                <h1><Users size={24} color={THEME.primary} /> Gestion des Utilisateurs</h1>
                <Button className="primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={16} /> Nouvel Utilisateur
                </Button>
            </Header>

            <Panel>
                {isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                        <ReactLoading type="spinningBubbles" color={THEME.primary} height={40} width={40} />
                    </div>
                ) : (
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Nom & Prénom</th>
                                    <th>Login</th>
                                    <th>Rôle</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: THEME.textMuted }}>
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(u => (
                                        <tr key={u._id}>
                                            <td><strong>{u.lastName} {u.firstName}</strong></td>
                                            <td>{u.login}</td>
                                            <td>
                                                <RoleBadge role={u.role}>
                                                    {u.role === 'cariste' ? 'Travaille au chariot' : 
                                                     u.role === 'chauffeur' ? 'Chauffeur' : 
                                                     u.role === 'admin' ? 'Admin' : 'Autre employé'}
                                                </RoleBadge>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                                    <Button className="secondary" style={{ padding: "6px 10px" }} onClick={() => handleOpenModal(u)}>
                                                        <Edit3 size={14} />
                                                    </Button>
                                                    <Button className="danger" style={{ padding: "6px 10px" }} onClick={() => handleDelete(u._id)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </TableWrapper>
                )}
            </Panel>

            <AnimatePresence>
                {isModalOpen && (
                    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ModalContent initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
                            <div className="modal-header">
                                <h3>{editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <label>Nom</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.lastName} 
                                        onChange={e => setFormData({...formData, lastName: e.target.value})} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Prénom</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.firstName} 
                                        onChange={e => setFormData({...formData, firstName: e.target.value})} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Login / Identifiant</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.login} 
                                        onChange={e => setFormData({...formData, login: e.target.value})} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Mot de passe {editingUser && "(Laisser vide pour ne pas modifier)"}</label>
                                    <input 
                                        type="password" 
                                        {...(!editingUser && { required: true })} 
                                        value={formData.password} 
                                        onChange={e => setFormData({...formData, password: e.target.value})} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Rôle</label>
                                    <select 
                                        value={formData.role} 
                                        onChange={e => setFormData({...formData, role: e.target.value})}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="chauffeur">Chauffeur</option>
                                        <option value="cariste">Travaille au chariot</option>
                                        <option value="autre">Autre employé</option>
                                    </select>
                                </FormGroup>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                                    <Button type="button" className="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                                    <Button type="submit" className="primary"><Save size={15} /> Enregistrer</Button>
                                </div>
                            </form>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AnimatePresence>
        </Container>
    );
}
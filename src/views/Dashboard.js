// Dashboard.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button as RsButton,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import MyDatePicker from "./Comp/MyDatePicker";
import "./Comp/dt.css";
import { Checkbox } from "@mui/material";
import NotificationAlert from "react-notification-alert";
import UserService from "Service/UserService";
import Form from "./Comp/Form";
import ReactLoading from "react-loading";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import styled from "styled-components";
import AdminService from "Service/AdminService";
import generatePDF from "./Comp/generatePDF";
import { socket } from "../index";
import Cookies from "js-cookie";
import generateExcel from "./Comp/generateExcel";
function Dashboard() {
  const location = useLocation();
  const nnavigate = useNavigate();
  const initialIdCRM = Cookies.get("idCRMClient") || undefined;
  const [idCRM, setIdCRM] = useState(initialIdCRM);
  useEffect(() => {
    const { idCRM } = location.state || {};
    if (idCRM !== undefined) {
      Cookies.set("idCRMClient", idCRM, { expires: 7 });
      setIdCRM(idCRM);
    }
  }, [location.state]);
  // console.log("idCRM",idCRM);
  const [loading, setLoading] = useState(false);
  const notificationAlert = React.useRef(null);
  // State to hold selected date range
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [DateRange, setdDateRange] = useState(null);
  const [StartDate, setdStartDate] = useState("");
  const [EndDate, setdEndDate] = useState("");
  const [tempReal, setTempReal] = useState(true);
  const [showModalDate, setShowModalDate] = useState(false);
  const [storesData, setStoresData] = useState({});
  const [RepeterApi, setRepeterApi] = useState(false);
  const [StoreInformation, setStoreInformation] = useState({});

  // useEffect(() => {
  //   const handleUpdate = (data) => {
  //     setRepeterApi(true);
  //   };

  //   if (tempReal === true) {
  //     socket.on(`UpdateTempsReels${idCRM}`, handleUpdate);
  //   }

  //   return () => {
  //     socket.off(`UpdateTempsReels${idCRM}`, handleUpdate);
  //   };
  // }, [socket, idCRM]);

  const GetStatFromTableReel = async (a, b, c) => {
    try {
      setStoresData({});
      // console.log("RepeterApi",RepeterApi)
      if (RepeterApi === false) {
        setLoading(true);
      }
      // console.log("abc",a,b,c)
      const data = await UserService.GetStatFromTableReel(
        Cookies.get("idCRMClient"),
        b,
        c
      );
      if (RepeterApi === false) {
        setLoading(false);
        //showNotification(data.msg, data.data !== null ? 'success' : 'danger');
      }

      // console.log(data.data)
      setStoresData(data.data);
      setRepeterApi(false);
    } catch (error) {
      if (RepeterApi === false) {
        setLoading(false);
      }

      console.error(error);
    }
  };
  const GetStatFromTableStats = async (a, b, c) => {
    try {
      setStoresData({});
      if (RepeterApi === false) {
        setLoading(true);
      }

      const data = await UserService.GetStatFromTableStats(a, b, c);
      if (RepeterApi === false) {
        setLoading(false);
        // showNotification(data.msg, data.data !== null ? 'success' : 'danger');
      }

      setStoresData(data.data);
      setRepeterApi(false);
    } catch (error) {
      if (RepeterApi === false) {
        setLoading(false);
      }

      console.error(error);
    }
  };
  // useEffect(() => {
  //   const fetchData = () => {
  //     if (DateRange === null) {
  //       const dateAjourdhui = new Date();
  //       const defaultStartDate = `${dateAjourdhui?.getFullYear()}${String(dateAjourdhui.getMonth() + 1).padStart(2, '0')}${String(dateAjourdhui?.getDate()).padStart(2, '0')}`;
  //       setdStartDate(defaultStartDate);
  //       setdEndDate(defaultStartDate);
  //       if (tempReal) { GetStatFromTableReel(idCRM, defaultStartDate, defaultStartDate); }
  //       else { GetStatFromTableStats(idCRM, StartDate, EndDate); }
  //     } else {
  //       const st = `${DateRange.startDate?.getFullYear()}${String(DateRange.startDate.getMonth() + 1).padStart(2, '0')}${String(DateRange.startDate?.getDate()).padStart(2, '0')}`;
  //       const end = `${DateRange.endDate?.getFullYear()}${String(DateRange.endDate.getMonth() + 1).padStart(2, '0')}${String(DateRange.endDate?.getDate()).padStart(2, '0')}`;

  //       setdStartDate(st);
  //       setdEndDate(end);
  //       if (tempReal) { GetStatFromTableReel(idCRM, st, end); }
  //       else { GetStatFromTableStats(idCRM, st, end); }
  //     }

  //   };

  //   // Fetch data immediately
  //   fetchData();

  //   //  console.log(".")
  //   //   const interval = setInterval(fetchData, 65000);

  //   //   // Clean up interval to prevent memory leaks
  //   //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    // console.log("Effect")
    const fetchData = () => {
      // console.log("EffectDateRange",DateRange)

      if (DateRange === null) {
        const dateAjourdhui = new Date();
        const defaultStartDate = `${dateAjourdhui?.getFullYear()}${String(
          dateAjourdhui.getMonth() + 1
        ).padStart(2, "0")}${String(dateAjourdhui?.getDate()).padStart(
          2,
          "0"
        )}`;
        setdStartDate(defaultStartDate);
        setdEndDate(defaultStartDate);
        // console.log("tempReal",tempReal)

        if (tempReal) {
          GetStatFromTableReel(idCRM, defaultStartDate, defaultStartDate);
        } else {
          GetStatFromTableStats(idCRM, StartDate, EndDate);
        }
      } else {
        const st = `${DateRange.startDate?.getFullYear()}${String(
          DateRange.startDate.getMonth() + 1
        ).padStart(2, "0")}${String(DateRange.startDate?.getDate()).padStart(
          2,
          "0"
        )}`;
        const end = `${DateRange.endDate?.getFullYear()}${String(
          DateRange.endDate.getMonth() + 1
        ).padStart(2, "0")}${String(DateRange.endDate?.getDate()).padStart(
          2,
          "0"
        )}`;

        setdStartDate(st);
        setdEndDate(end);
        if (tempReal) {
          GetStatFromTableReel(idCRM, st, end);
        } else {
          GetStatFromTableStats(idCRM, st, end);
        }
      }
    };

    // Fetch data immediately
    fetchData();

    //  console.log(".")
    //   const interval = setInterval(fetchData, 65000);

    //   // Clean up interval to prevent memory leaks
    //   return () => clearInterval(interval);
  }, [DateRange, tempReal, RepeterApi === true && tempReal === true, idCRM]);

  useEffect(() => {
    const getUser = async () => {
      // Mark the function as async
      try {
        if (idCRM != undefined) {
          const data = await AdminService.getUserByIDcrm(idCRM);
          setStoreInformation(data.data);
        }
      } catch (error) {
        // Handle error
      }
    };

    getUser();
  }, [idCRM]);

  const openModalDate = () => {
    setShowModalDate(true);
  };

  const closeModalDate = () => {
    setShowModalDate(false);
  };

  const handleDateSelection = (dateRange) => {
    setSelectedDateRange(dateRange);
   // console.log("2", dateRange);
  };

  const EnvoyerNewDate = () => {
    setdDateRange(selectedDateRange);
    //console.log("selectedDateRange", selectedDateRange);
    closeModalDate();
  };
  const handleCheckboxChange = (event) => {
    // if (event.target.checked) { showNotification("Les statistiques de caisse seront obtenues pour celles qui ne sont pas encore clôturées.", 'success'); }
    // else { showNotification(" Les statistiques de caisse seront obtenues pour celles qui ont clôturées.", 'success'); }
    setTempReal(event.target.checked);
  };
  const showNotification = (message, type) => {
    const options = {
      place: "tr",
      message: <div>{message}</div>,
      type: type,
      autoDismiss: 3,
    };
    notificationAlert.current.notificationAlert(options);
  };

  const replaceUnderscores = (str) => {
    return str.replace(/_/g, " ");
  };

  const formatValue = (value, devise) => {
    // && value.toString().includes('.')
    if (devise === "DT") {
      return parseFloat(value).toFixed(3); // Formats to three decimal places
    } else {
      return value; // Return as it is
    }
  };

  const handlePDF = () => {
    generatePDF(storesData, StoreInformation, StartDate, EndDate);
  };
  const handleExel = () => {
    generateExcel(storesData, StoreInformation, StartDate, EndDate);
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="content">
      {/* Display selected date range or default to current date */}
      <div style={{ textAlign: "center" }}>
        {StoreInformation && (
          <div>
            {" "}
            <h5>
              <strong>{StoreInformation.Nom}</strong>
            </h5>
          </div>
        )}
        <RsButton
          onClick={openModalDate}
          style={{ border: "inset", fontSize: "12px" }}
        >
          {DateRange
            ? `${formatDate(DateRange.startDate)} - ${formatDate(
                DateRange.endDate
              )}`
            : formatDate(new Date())}
        </RsButton>
        <Checkbox
          checked={tempReal}
          onChange={handleCheckboxChange}
          style={{ color: "#212529", marginRight: "4px" }}
        />{" "}
        <label
          style={{ marginLeft: "-15px", color: "#212529", fontWeight: "bold" }}
        >
          Temps réel
        </label>
        <div>
          <span style={{ fontSize: "0.6rem" }}>
            Si la case 'Temps réel' est cochée, vous récupérez les données des
            statistiques qui ne sont pas clôturées. Sinon, vous récupérez les
            données des statistiques clôturées.
          </span>
        </div>
      </div>
      {/* storesData &&storesData.length!=0 */}
      {RepeterApi && loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "250px",
          }}
        >
          <ReactLoading type={"spin"} color={"#000"} height={50} width={50} />
        </div>
      ) : (
        <div>
          {storesData && (
            <div>
              {/* Vue globale C.A */}
              <div style={{ marginTop: "50px" }}>
                <h5> Vue globale C.A</h5> <hr></hr>
                <div className="content2" style={{ marginTop: "10px" }}>
                  {storesData.ChiffreAffaire &&
                    Object.keys(storesData.ChiffreAffaire).map((key, index) => (
                      <div key={index}>
                        <Form
                          key1={key}
                          devise={storesData.devise}
                          value={storesData.ChiffreAffaire[key]}
                          StartDate={StartDate}
                          EndDate={EndDate}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* Les Modes de paiement */}
              <div style={{ marginTop: "40px" }}>
                <h5 style={{ marginTop: "10px" }}> Les Modes de paiement </h5>{" "}
                <hr></hr>
                <div className="content2" style={{ marginTop: "10px" }}>
                  {storesData.modePaiement &&
                    Object.keys(storesData.modePaiement).map((key, index) => (
                      <div key={index}>
                        {storesData.modePaiement[key] != 0 && (
                          <Form
                            key1={key}
                            devise={storesData.devise}
                            value={storesData.modePaiement[key]}
                            StartDate={StartDate}
                            EndDate={EndDate}
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
              {/* Les Modes de consommation */}
              <div style={{ marginTop: "40px" }}>
                <h5 style={{ marginTop: "10px" }}>
                  {" "}
                  Les Modes de consommation{" "}
                </h5>{" "}
                <hr></hr>
                <div className="content2" style={{ marginTop: "10px" }}>
                  {storesData.modeConsommation &&
                    Object.keys(storesData.modeConsommation).map(
                      (key, index) => (
                        <div key={index}>
                          {storesData.modeConsommation[key] != 0 && (
                            <Form
                              key1={key}
                              devise={storesData.devise}
                              value={storesData.modeConsommation[key]}
                              StartDate={StartDate}
                              EndDate={EndDate}
                            />
                          )}
                        </div>
                      )
                    )}
                </div>
              </div>
              <div style={{ marginTop: "50px" }}>
                <h5> Etats Ticket</h5> <hr></hr>
                <div className="content2" style={{ marginTop: "10px" }}>
                  {storesData.EtatTiquer &&
                    Object.keys(storesData.EtatTiquer).map((key, index) => (
                      <div key={index}>
                        <Form
                          key1={key}
                          devise={"chiffre"}
                          value={storesData.EtatTiquer[key]}
                          StartDate={StartDate}
                          EndDate={EndDate}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* tva de ddes ventes */}
              <div style={{ marginTop: "40px" }}>
                <h5 style={{ marginTop: "10px" }}>TVA par Taux </h5> <hr></hr>
                <div className="content2" style={{ marginTop: "10px" }}>
                  {storesData.ChiffreAffaireDetailler &&
                    Object.keys(storesData.ChiffreAffaireDetailler).map(
                      (outerKey, outerIndex) => (
                        <div key={outerIndex}>
                          <Form
                            key1={outerKey}
                            devise={storesData.devise}
                            value={
                              storesData.ChiffreAffaireDetailler[outerKey].TVA
                            }
                            value1={storesData.devise}
                            StartDate={StartDate}
                            EndDate={EndDate}
                          />
                        </div>
                      )
                    )}
                </div>
              </div>

              {/* <div style={{ marginTop: "40px" }}>
                <h5 style={{ marginTop: "10px" }}> <strong>Produit detailler</strong> </h5> <hr></hr>
                {storesData.ProduitDetailler && 
  <StyledTableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <StyledTableCell width={"30%"} align="left">Nom de produit</StyledTableCell>
          <StyledTableCell width={"20%"} align="center">Quantité</StyledTableCell>
          <StyledTableCell width={"20%"} align="center">Prix</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {storesData.ProduitDetailler && Object.keys(storesData.ProduitDetailler).map((productName, index) => {
          const productDetails = storesData.ProduitDetailler[productName];
          if (productName !== "SommeTOTAL") {
            const teest=formatValue(productDetails.Somme,storesData.devise);
            return (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row" width={"30%"} align="left">
                  <StyledStrong>{replaceUnderscores(productName)}</StyledStrong> 
                </StyledTableCell>
                <StyledTableCell width={"20%"} align="center">
                  <StyledStrong>{productDetails.Qty > 0 ? productDetails.Qty : "XX"}</StyledStrong>
                </StyledTableCell>
                <StyledTableCell width={"20%"} align="center">
                  <StyledStrong>{teest}{storesData.devise}</StyledStrong>  
                </StyledTableCell>
              </StyledTableRow>
            );
          } else {
            return null; 
          }
        })}
      </TableBody>
    </Table>
  </StyledTableContainer>
}
              </div> */}
            </div>
          )}
        </div>
      )}

      {/* Modal for selecting date */}
      <Modal isOpen={showModalDate} toggle={closeModalDate}>
        <ModalHeader toggle={closeModalDate}>Choisir une date</ModalHeader>
        <ModalBody>
          <MyDatePicker
            onDateSelection={handleDateSelection}
            initialDateRange={selectedDateRange}
          />
        </ModalBody>
        <ModalFooter>
          <RsButton color="primary" onClick={EnvoyerNewDate}>
            Changer la Date{" "}
          </RsButton>
          <RsButton color="secondary" onClick={closeModalDate}>
            Annuler
          </RsButton>
        </ModalFooter>
      </Modal>

      {RepeterApi === false && <NotificationAlert ref={notificationAlert} />}
      {storesData.ChiffreAffaire && (
        <div style={{ textAlign: "center" }}>
          <RsButton onClick={handlePDF}>Télécharger en format PDF </RsButton>
          <RsButton onClick={handleExel}>Télécharger en format Exel </RsButton>
        </div>
      )}
      {storesData.ChiffreAffaire && <div style={{ textAlign: "center" }}></div>}

      {/* {storesData.ChiffreAffaire &&     <div style={{ textAlign: "center" }}><RsButton onClick={handlePDF}>Envoyer en email </RsButton></div>} */}
    </div>
  );
}

export default Dashboard;
const StyledTableContainer = styled(TableContainer)`
  && {
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
`;

const StyledTableRow = styled(TableRow)`
  && {
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const StyledTableCell = styled(TableCell)`
  && {
    font-weight: bold;
    padding: 16px;
    font-size: 14px;
  }
`;

const StyledStrong = styled.strong`
  color: #2b2f3b;
`;

//Get ALL ChiffreAffaireDetailler DETAIILER
// {storesData.ChiffreAffaireDetailler && Object.keys(storesData.ChiffreAffaireDetailler).map((outerKey, outerIndex) => (
//   <div key={outerIndex}>
//     {Object.keys(storesData.ChiffreAffaireDetailler[outerKey]).map((innerKey, innerIndex) => (
//       outerKey === "Taux" ? (
//         <div key={innerIndex}>
//           <h5 style={{ marginTop: "10px" }}>{storesData.ChiffreAffaireDetailler[outerKey][innerKey]}</h5>
//           <hr />
//         </div>
//       ) : (
//         <div key={innerIndex}>
//           <Form value2={innerKey} value3={storesData.ChiffreAffaireDetailler[outerKey][innerKey]} />
//         </div>
//       )
//     ))}
//   </div>
// ))}

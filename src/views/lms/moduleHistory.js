import React, { useEffect, useState } from "react";

import { Card, CardTitle, Row, Button, Col } from "react-bootstrap";

import { postDataFromApi } from "../../services/commonServices";
import { HistoryApi } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { getFormatedDate } from "../../services/commonFunction";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import OverlayLoading from "../../components/common/OverlayLoading";
const ModuleHistory = () => {
  let historyData;
  const session = useSelector((state) => state.session);
  historyData = session.historyData;
  const [historyDetails, setHistoryDetails] = useState([]);
  const [isOverlayLoader, setIsOverlayLoader] = useState(false);
  let navigate = useNavigate();
  
  useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      if (isMounted) {
        fetchHistory();
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchHistory = async () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const jrf_id = decryptDataForURL(params.get("id"));
    setIsOverlayLoader(true)
    let payload = {
      object_id: jrf_id,
      model: historyData.model,
    };
    let res = await postDataFromApi(HistoryApi, payload);
    if (res?.data?.status === 200) {
      setHistoryDetails(res.data.data);
    } else {
      toast.error(res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setIsOverlayLoader(false)
  };

  const icons = [
    { name: "saved", icon: "bi bi-cloud-check" },
    { name: "posted", icon: "bi bi-cloud-check" },
    { name: "accepted", icon: "bi bi-check-lg" },
    { name: "rejected", icon: "bi bi-x-circle-fill" },
    { name: "cancelled", icon: "bi bi-x-circle-fill" },
    { name: "tasked", icon: "bi bi-cloud-check" },
    { name: "completed", icon: "bi bi-shield-check" },
    { name: "create", icon: "bi bi-clock-history" },
    { name: "update", icon: "bi bi-chat-left-text" },
    { name: "delete", icon: "bi bi-file-earmark-x" },
  ];

  return (
    <Row>
      {isOverlayLoader && <OverlayLoading />}
      <Col>
        <Card>
          <CardTitle tag="h5" className="history_title">
            <div>
              LMS <i className="bi bi-chevron-right card-title-icon"></i>{" "}
              <button
                className="breadcrumb_button"
                type="button"
                onClick={() => navigate(historyData.redirect)}
              >
                {historyData.Breadcrumb}{" "}
              </button>
              <i className="bi bi-chevron-right card-title-icon"></i> History
            </div>
          </CardTitle>

          <div className="historyContainer">
            {historyDetails.length > 0 ? (
              historyDetails.map((item, itemIndex) => (
                <div
                  className="historyContainerItem"
                  key={"History" - itemIndex}
                >
                  <div className="historyContainerItemBox">
                    <div className="historyContainerAvatar">
                      {icons.map((sym, symIndex) =>
                        item?.action_flag?.toLowerCase() === sym.name ? (
                          <i className={sym.icon} key={"sym" - symIndex}></i>
                        ) : null
                      )}
                    </div>
                    <p>
                      {item.change_message}{" "}
                      <br />
                      <span>{getFormatedDate(item.action_time)}</span>
                    </p>
                  </div>

                </div>
              ))
            ) : (
              <div className="historyContainerItemBox">
                <p>No History Found</p>
              </div>
            )}
          </div>
        </Card>
        <div className="submit_btns">
          <Button
            type="submit "
            className="saveBtn"
            id="submit_btn3"
            onClick={() => navigate(historyData.redirect)}
          >
            Back To List
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default ModuleHistory;

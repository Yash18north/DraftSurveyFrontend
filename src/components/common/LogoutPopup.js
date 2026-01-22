import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "../../services/localStorageServices";
import {
  clearSessionAsync,
  refreshSession,
  logout,
} from "../../reducers/sessionActions";
import { useNavigate } from "react-router-dom";
import { postDataFromApi } from "../../services/commonServices";
import { refreshApi } from "../../services/api";
import PropTypes from "prop-types";

function LogoutPopup({ handleLogout, sessionData, setIsLoggedInUser }) {
  const expiryTime = useSelector((state) => state.session.expiryTime);
  const expdatetime = useSelector((state) => state.session.expdatetime);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [idleModal, setIdleModal] = useState(false);
  const [modalReason, setModalReason] = useState(""); // "idle" or "expiry"
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Timer refs
  const idleTimerRef = useRef(null);
  const popupTimerRef = useRef(null);
  const preExpiryTimerRef = useRef(null);
  const totalLogoutTimerRef = useRef(null);

  const refreshToken = sessionData?.refresh_token;

  /** Configurable times */
  const idleTimeMin = 15; //15
  const popupTimeMin = 5; //5
  const warningBeforeExpiryMin = 2; //2

  const idleTimeout = 1000 * 60 * idleTimeMin;
  const popupTimeout = 1000 * 60 * popupTimeMin;
  const warningBeforeExpiryMs = 1000 * 60 * warningBeforeExpiryMin;

  /** Refresh access token */
  const RefreshingToken = async () => {
    if (!sessionData || sessionData === "loggedout") return;
    try {
      const response = await postDataFromApi(refreshApi, { refresh: refreshToken });
      if (response?.data?.status === 200) {
        setIsRefreshing(true);
        const newAccess = response.data.access;
        const expirySeconds = Math.round(parseFloat(sessionData.expiry_time)) || 1500;
        const newexpdatetime = Date.now() + expirySeconds * 1000;

        dispatch(refreshSession(newAccess, expirySeconds, newexpdatetime));
        setIdleModal(false);
        resetIdleTimers();
        startPreExpiryWarningTimer();
        startTotalSessionTimer();

        setTimeout(() => setIsRefreshing(false), 500);
      } else logOut();
    } catch (error) {
      console.error("Token refresh failed:", error);
      logOut();
    }
  };

  /** Clear session completely */
  const clearSessionFromLocaleStorage = () => {
    dispatch(logout());
    removeToken();
    localStorage.clear();
    localStorage.setItem("user-logged-out", Date.now().toString());
    dispatch(clearSessionAsync());
    setIdleModal(false);
    setModalReason("");
    setTimeout(() => navigate("/login"), 250);
  };

  /** Idle timer */
  const resetIdleTimers = () => {
    if (!sessionData || sessionData === "loggedout") return;
    clearTimeout(idleTimerRef.current);
    clearTimeout(popupTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      setModalReason("idle");
      setIdleModal(true);

      popupTimerRef.current = setTimeout(() => logOut(), popupTimeout);
    }, idleTimeout);
  };

  /** Pre-expiry warning */
  const startPreExpiryWarningTimer = () => {
    if (!sessionData || sessionData === "loggedout") return;
    clearTimeout(preExpiryTimerRef.current);
    const remainingMs = Math.max(expdatetime - Date.now(), 0);
    const popupDelay = Math.max(remainingMs - warningBeforeExpiryMs, 0);

    preExpiryTimerRef.current = setTimeout(() => {
      setModalReason("expiry");
      setIdleModal(true);

      popupTimerRef.current = setTimeout(() => logOut(), warningBeforeExpiryMs);
    }, popupDelay);
  };

  /** Total session logout */
  const startTotalSessionTimer = () => {
    if (!sessionData || sessionData === "loggedout") return;
    clearTimeout(totalLogoutTimerRef.current);
    const remainingMs = Math.max(expdatetime - Date.now(), 0);
    totalLogoutTimerRef.current = setTimeout(() => logOut(), remainingMs);
  };

  /** Extend session */
  const extendSession = () => {
    if (!sessionData || sessionData === "loggedout") return;
    setIdleModal(false);
    clearTimeout(idleTimerRef.current);
    clearTimeout(popupTimerRef.current);
    clearTimeout(preExpiryTimerRef.current);
    RefreshingToken();
    localStorage.setItem("session-extended", Date.now().toString());
  };

  /** Manual logout */
  const logOut = () => {
    if (!sessionData || sessionData === "loggedout") return;
    clearTimeout(idleTimerRef.current);
    clearTimeout(popupTimerRef.current);
    clearTimeout(preExpiryTimerRef.current);
    clearTimeout(totalLogoutTimerRef.current);
    setIdleModal(false);
    setModalReason("");
    handleLogout();
    clearSessionFromLocaleStorage();

    localStorage.setItem("user-logged-out", Date.now().toString());
  };

  /** Reset idle on user activity */
  useEffect(() => {
    if (!sessionData || sessionData === "loggedout") return;
    const events = ["click", "keypress", "mousemove", "scroll"];
    const resetHandler = () => {
      // localStorage.setItem("session-reset-handle", Date.now().toString());
      resetIdleTimers()
    };

    resetIdleTimers();
    startPreExpiryWarningTimer();
    startTotalSessionTimer();

    events.forEach((e) => window.addEventListener(e, resetHandler));
    return () => {
      clearTimeout(idleTimerRef.current);
      clearTimeout(popupTimerRef.current);
      clearTimeout(preExpiryTimerRef.current);
      clearTimeout(totalLogoutTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetHandler));
    };
  }, [expiryTime, expdatetime, sessionData]);

  /** Monitor backend expiry */
  useEffect(() => {
    if (!sessionData || sessionData === "loggedout") return;
    const interval = setInterval(() => {
      if (!expiryTime) return;
      if (Date.now() > expdatetime) logOut();
      else setIsLoggedInUser(true);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, expdatetime, sessionData]);

  /** Multi-tab logout */
  // useEffect(() => {
  //   const handleStorageEvent = (event) => {
  //     if (event.key === "user-logged-out") navigate("/login");
  //   };
  //   window.addEventListener("storage", handleStorageEvent);
  //   return () => window.removeEventListener("storage", handleStorageEvent);
  // }, []);
  useEffect(() => {
    const handleStorageEvent = (event) => {
      if (event.key === "user-logged-out") {
        clearSessionFromLocaleStorage();
      } else if (['session-reset-handle',"session-extended"].includes(event.key)) {
        resetIdleTimers();
        startPreExpiryWarningTimer();
        startTotalSessionTimer();
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={idleModal && sessionData && sessionData !== "loggedout"}
      onHide={extendSession}
    >
      <Modal.Header closeButton>
        <Modal.Title>Session Expiring Soon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalReason === "idle"
          ? `You have been idle for ${idleTimeMin} minutes. Do you want to extend the session?`
          : "Your session is about to expire. Please extend it or you will be logged out."}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={logOut}>
          Logout
        </Button>
        <Button variant="primary" onClick={extendSession}>
          Extend Session
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

LogoutPopup.propTypes = {
  handleLogout: PropTypes.func,
  sessionData: PropTypes.object,
  setIsLoggedInUser: PropTypes.func,
};

export default LogoutPopup;

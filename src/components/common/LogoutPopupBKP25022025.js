import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "../../services/localStorageServices";
import { clearSessionAsync, refreshSession, logout } from "../../reducers/sessionActions";
import { useNavigate } from "react-router-dom";
import { postDataFromApi } from "../../services/commonServices";
import { refreshApi } from "../../services/api";
import PropTypes from "prop-types";

function LogoutPopup({ handleLogout, sessionData, setIsLoggedInUser }) {
  let expiryTime = useSelector((state) => state.session.expiryTime);
  let expdatetime = useSelector((state) => state.session.expdatetime);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [idleModal, setIdleModal] = useState(false);
  const [isRefereshToken, setIsRefereshToken] = useState(false);
  const sessiontmeOut = 15;//210
  let logoutTimeOut = parseInt(sessiontmeOut) + 5;//25
  const idleTimeout = 1000 * 60 * sessiontmeOut; // in minutes
  const idleLogout = 1000 * 60 * logoutTimeOut; // in minutes
  const sessionAboutToExpire = 120000;
  let refreshToken = sessionData?.refresh_token;
  let idleEvent;
  let idleLogoutEvent;

  const RefreshingToken = async () => {
    try {
      const response = await postDataFromApi(refreshApi, { refresh: refreshToken });
      if (response?.data && response?.data?.status === 200) {
        setIsRefereshToken(true)
        const newAccess = response.data.access;
        // const newExpiryTime = Date.now() + (expiryTime * 1000);
        // dispatch(refreshSession(newAccess, expiryTime, newExpiryTime));
        let expiryTimeInSeconds =
          Math.round(parseFloat(sessionData.expiry_time)) || 7200;
        const newexpiryTime = expiryTimeInSeconds;
        const newexpdatetime = Date.now() + expiryTimeInSeconds * 1000;
        dispatch(refreshSession(newAccess, newexpiryTime, newexpdatetime));
        // window.location.reload();
        setIdleModal(false);
        setTimeout(() => {
          setIsRefereshToken(false)
        }, 10);
        return;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      setTimeout(async () => {
        try {
          const retryResponse = await postDataFromApi(refreshApi, { refresh: refreshToken });
          if (retryResponse?.data?.status === 200) {
            const newAccess = retryResponse.data.access;
            const newExpiryTime = Date.now() + expiryTime * 1000;
            dispatch(refreshSession(newAccess, expiryTime, newExpiryTime));
            // window.location.reload();
            setIdleModal(false);
            return;
          }
        } catch (retryError) {
          console.error("Token refresh retry failed:", retryError);
          dispatch(logOut());
        }
      }, 2000); // Retry after 2 seconds
    }
  };

  const clearSessionFromLocaleStorage = () => {
    dispatch(logout());
    removeToken();
    localStorage.clear();
    localStorage.setItem("user-logged-out", Date.now().toString());
    dispatch(clearSessionAsync());
    setTimeout(() => {
      navigate("/login");
    }, 250);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (sessionData !== "loggedout" && expiryTime && Date.now() > expdatetime) {
        handleLogout();
        clearSessionFromLocaleStorage();
      } else if (sessionData !== "loggedout" && expiryTime && Date.now() > expdatetime - 3000) {
        setIdleModal(false);
        handleLogout();
        clearInterval(interval);
      } else if (sessionData !== "loggedout" && expiryTime && Date.now() > expdatetime - sessionAboutToExpire) {
        setIdleModal(true);
      } else {
        setIsLoggedInUser(true);
      }
    }, 1000);
    if (isRefereshToken) {
      clearInterval(interval)
    }
    return () => clearInterval(interval);
  }, [expiryTime, refreshToken, sessionData, isRefereshToken]);

  const events = ["click", "keypress"];
  const sessionTimeout = () => {
    setIdleModal(false);
    if (idleEvent) clearTimeout(idleEvent);
    if (idleLogoutEvent) clearTimeout(idleLogoutEvent);
    idleEvent = setTimeout(() => setIdleModal(true), idleTimeout);
    idleLogoutEvent = setTimeout(() => handleLogout(), idleLogout);
  };

  const extendSession = () => {
    clearTimeout(idleEvent);
    clearTimeout(idleLogoutEvent);
    setIdleModal(false);
    RefreshingToken();
  };

  const logOut = () => {
    clearTimeout(idleEvent);
    clearTimeout(idleLogoutEvent);
    handleLogout();
  };

  useEffect(() => {
    sessionTimeout()
    events.forEach((event) => window.addEventListener(event, sessionTimeout));
    return () => {
      clearTimeout(idleEvent);
      clearTimeout(idleLogoutEvent);
      events.forEach((event) => window.removeEventListener(event, sessionTimeout));
    };
  }, []);

  return (
    <span>
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={idleModal} onHide={() => RefreshingToken()}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {idleModal ? (
            `Your session will expire in ${(idleLogout - idleTimeout) / 60 / 1000} minutes. Do you want to extend the session?`
          ) : (
            "Your session has expired. Please login again."
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary" variant="primary" onClick={logOut}>Logout</Button>
          <Button className="btn btn-danger" onClick={extendSession}>Extend session</Button>
        </Modal.Footer>
      </Modal>
    </span>
  );
}

LogoutPopup.propTypes = {
  handleLogout: PropTypes.func,
  expiryTime: PropTypes.number,
  expdatetime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sessionData: PropTypes.object,
  setIsLoggedInUser: PropTypes.func,
};

export default LogoutPopup;
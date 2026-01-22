import React from "react";
import tick from "../assets/images/logos/red_tick.png";
import { useNavigate } from "react-router-dom";
import Sliders from "./Sliders";
import { ToastContainer } from "react-bootstrap";

const ExternalJRFApprovalPage = () => {
  const navigate = useNavigate();
  return (
    <div className="login_page">
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}

      <Sliders />

      <form
        className="login_container external-jrf"
        onSubmit={() => navigate("/login")}
      >
        <img src={tick} alt="tick" />
        <h1 className="forgot_password_successfully">Successfully</h1>

        <h3 className="forgot_password_sub_title_successfully">
          Created JRF please approve it.
        </h3>

        <button type="button">
          Continue
        </button>
      </form>
    </div>
  );
};

export default ExternalJRFApprovalPage;

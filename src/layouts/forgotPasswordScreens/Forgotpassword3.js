import React, { useRef, useState, useEffect } from "react";
import { resendOtpApi, verifyOtpApi } from "../../services/api";
import { postDataFromApi } from "../../services/commonServices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Forgotpassword3 = ({ setScreen, data, inputType, setUserName }) => {
  const { t } = useTranslation();
  const translate = t;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [timer, setTimer] = useState(600);
  const [formDataError, setFormDataError] = useState({
    otp: "",
  });
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    if (otp[index] === "" || value === "") {
      newOtp[index] = value;
    }

    setOtp(newOtp);

    if (value !== "" && index < 5) {
      refs[index + 1].current.focus();
    } else if (value === "" && index > 0) {
      refs[index - 1].current.focus();
    } else if (value !== "" && index === 5) {
      // When the last input field is filled, blur it
      refs[index].current.blur();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setTimer(30);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const received_otp = otp.join("");
    if (received_otp === "") {
      setFormDataError((prevState) => ({
        ...prevState,
        otp: translate("forgotPasswordPage.errorMessages.OtpRequired"),
      }));
      return;
    } else if (received_otp.length !== 6) {
      setFormDataError((prevState) => ({
        ...prevState,
        otp: translate("forgotPasswordPage.errorMessages.valideOtp"),
      }));
      return;
    } else {
      setFormDataError((prevState) => ({
        ...prevState,
        otp: "",
      }));
    }
    let bodyToPass = {
      otp: received_otp,
      context: "password_reset",
    };

    let res = await postDataFromApi(verifyOtpApi, bodyToPass);
    if (res?.data?.status === 200) {
      setScreen(4);
      setUserName(res.data.data.username);
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
  };

  const handleResend = async (e) => {
    const type = inputType(data);
    let bodyToPass;
    bodyToPass = {
      username: data,
    };

    let res = await postDataFromApi(resendOtpApi, bodyToPass);
    if (res?.data?.status === 200) {
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
  };
  return (
    <form className="login_container" onSubmit={(e) => handleSubmit(e)}>
      <h1 className="login_title">
        {translate("forgotPasswordPage.forgotPasswordTitle")}
      </h1>

      <h3 className="forgot_password_sub_title">
        {translate("forgotPasswordPage.otpSuggestionText")}
      </h3>

      <div className="forgot_password_otp">
        {otp.map((value, index) => (
          <input
            key={"Forgot Password" + index}
            type="number"
            minLength="1"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            ref={refs[index]}
          />
        ))}
      </div>
      {formDataError.otp && (
        <label htmlFor="error message" className="login_container_label_error">
          <p className="text-danger errorMsg">{formDataError.otp}</p>
        </label>
      )}
      <div className="forgot_password_otp_timer">{formatTime(timer)}</div>

      <button type="submit">
        {translate("forgotPasswordPage.continueBtn")}
      </button>
      <div className="forgot_password_resend">
        {translate("forgotPasswordPage.resendSuggestionText")}{" "}
        <button
          type="button"
          className="forgot_password_resend_link"
          onClick={() => handleResend()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleResend();
            }
          }}
        >
          {translate("forgotPasswordPage.resendBtn")}
        </button>
      </div>
      <div className="forgot_password_resend">
        <span></span>
        <Link to="/login">{translate("forgotPasswordPage.loginBack")}</Link>
      </div>
    </form>
  );
};
Forgotpassword3.propTypes = {
  setScreen: PropTypes.func.isRequired, // Assuming setScreen is a function that must be provided
  data: PropTypes.shape({
    // Define the expected shape of the 'data' prop if it has a specific structure
    // For example:
    username: PropTypes.string,
    email: PropTypes.string,
    // Add other properties based on the actual structure of `data`
  }).isRequired, // Assuming data is an object with specific fields
  inputType: PropTypes.string, // Assuming inputType is a string; adjust if needed
  setUserName: PropTypes.func, // Assuming setUserName is an optional function
};
export default Forgotpassword3;

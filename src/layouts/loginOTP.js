import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { postDataFromApi } from "../services/commonServices";
import { loginSuccess, logout } from "../actions/authActions";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOutApi, resendOtpApi, verifyOtpApi } from "../services/api";
import Sliders from "./Sliders";
import { redirectPageAfterLogin } from "../services/commonFunction";
import { useTranslation } from "react-i18next";
import { setSessionAsync, clearSessionAsync } from "../reducers/sessionActions";
import OverlayLoading from "../components/common/OverlayLoading";
import { decryptDataForURL } from "../utills/useCryptoUtils";

const LoginOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const session = useSelector((state) => state.session);
  const OTPData = session?.OTPData || null;
  const translate = t;
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      refs[index + 1].current.focus();
    } else if (value === "" && index > 0) {
      refs[index - 1].current.focus();
    } else if (value !== "" && index === 5) {
      refs[index].current.blur();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    const pastedChars = pastedData.split("").filter((char) => !isNaN(char));
    const newOtp = [...otp];

    for (let i = 0; i < pastedChars.length && i < 6; i++) {
      newOtp[i] = pastedChars[i];
    }

    setOtp(newOtp);
  };
  const [allowResend, setAllowResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (OTPData?.timer > 0) {
        // setTimer(timer - 1);
        dispatch({
          type: "LOGIN_OTP_DATA",
          OTPData: {
            ...OTPData,
            timer: OTPData?.timer - 1
          },
        });
      } else if (OTPData?.timer === 0) {
        setAllowResend(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [OTPData?.timer]);

  const handleLogout = async (sessionUser) => {
    let res = await postDataFromApi(LogOutApi, {
      refresh_token: sessionUser?.refresh_token,
    });
    if (res.data.status === 200) {
      dispatch(logout());
      localStorage.clear();
      localStorage.setItem("user-logged-out", Date.now().toString());
      dispatch(clearSessionAsync());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const received_otp = parseInt(otp.join(""), 10);
    // const user = decryptDataForURL(localStorage.getItem("username"));
    const user = OTPData.username;
    let bodyJson = {
      username: user,
      otp: received_otp,
    };
    setIsLoading(true);

    try {
      const response = await postDataFromApi(verifyOtpApi, bodyJson);
      if (response?.data.status === 200) {
        let actualResonse = response.data.data;
        const role = actualResonse?.logged_in_user_info.role;
        actualResonse.role = role;
        dispatch(loginSuccess(actualResonse));
        dispatch(setSessionAsync(actualResonse));
        setIsLoading(false);
        if (role !== "ADMIN") {
          redirectPageAfterLogin(navigate, role);
        } else {
          let sessionUser = response.data.data;
          handleLogout(sessionUser);
          alert(translate("loginPage.nonAdminLogin"));
        }
      } else {
        setTimeout(() => {
          toast.error(response.data.message || translate("loginPage.unExpectedError"), {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }, 500);

      }
    } catch (error) {
      setTimeout(() => {
        toast.error(translate("loginPage.unExpectedError"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds
      }`;
  };

  const handleResend = async (e) => {
    try {
      setIsLoading(true);
      // const empID = decryptDataForURL(localStorage.getItem("username"));
      const empID = OTPData.username;
      let bodyToPass = {
        username: empID,
      };

      let response = await postDataFromApi(resendOtpApi, bodyToPass);
      if (response?.data && response.data.status === 200) {
        toast.success(response.data.message, {
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
        toast.error(response.message, {
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
    }
    finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login_page_bg">

      {isLoading && <OverlayLoading />}
      <div className="login_page">
        <ToastContainer
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
        />
        <Sliders />
        <img
          src={"https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_1_1_29092025_2057.jpeg"}
          width="120"
          className="tcrcLogo_login"
          alt="logo"
        />
        <form className="login_container" onSubmit={handleSubmit}>
          <h1 className="login_title">Verify User</h1>

          <h3 className="forgot_password_sub_title">
            Enter your 6 digits code that you received on your email.
          </h3>

          <div className="forgot_password_otp">
            {otp.map((value, index) => (
              <input
                key={"Forgot Password" + index}
                type="number"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onPaste={handlePaste}
                ref={refs[index]}
              />
            ))}
          </div>
          <div className="forgot_password_otp_timer">{formatTime(OTPData?.timer || 0)}</div>
          <div className="loginBtnContainer otpVerifyPage">
            <button type="submit">Continue</button>
          </div>
          <div className="password_options backBtnOTP">
            <span></span>
            {/* <button
                className="forgot_password_resend_link"
                type="button"
                onClick={() => handleLogout(OTPData.LoginData)}
              >Back to Login ?</button> */}
            <Link to="/login">Back to Login ?</Link>
          </div>
          {allowResend && (
            <div className="forgot_password_resend">
              If you didn't receive a code!{" "}
              <button
                className="forgot_password_resend_link"
                type="button"
                onClick={() => handleResend()}
              >
                Resend
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginOTP;

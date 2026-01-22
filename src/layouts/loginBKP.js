import React, { useEffect, useState } from "react";
import user from "../assets/images/logos/user.png";
import lock from "../assets/images/logos/lock.png";
import Loading from "../components/common/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetTenantDetails, postDataFromApi } from "../services/commonServices";
import { isDevelopments } from "../services/commonServices";
import { LoginApi } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../actions/authActions";
import {
  checkPasswordValidation,
  redirectPageAfterLogin,
} from "../services/commonFunction";
import Sliders from "./Sliders";
import { useTranslation } from "react-i18next";

import { setSessionAsync, clearSessionAsync } from "../reducers/sessionActions";

import { LogOutApi } from "../services/api";
import { logout } from "../actions/authActions";
import OverlayLoading from "../components/common/OverlayLoading";
import { encryptDataForURL } from "../utills/useCryptoUtils";
import tcrcLogo from "../assets/images/logos/tcrcLogo.png";

const Login = () => {
  const { t } = useTranslation();
  const translate = t;
  const [showPassword, setShowPassword] = useState(false);
  let isAuthenticated;
  const session = useSelector((state) => state.session);
  isAuthenticated = session.isAuthenticated;

  const [showIcon, setShowIcon] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [actionClicked, setActionClicked] = useState(null);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/jrfListing");
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formDataError, setFormDataError] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "password") {
      setShowIcon(e.target.value !== "");
    } else {
      value = value.replace(/\s+/g, "");
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setTimeout(() => {
      checkValidation();
    }, 10);
  };

  const checkValidation = () => {
    let usernameError = "";
    let passwordError = "";
    let IsValide = true;
    if (formData.username === "") {
      usernameError = translate("loginPage.errorMessages.employeeIdRequired");
      IsValide = false;
    } else {
      usernameError = "";
    }
    if (formData.password === "") {
      passwordError = translate("loginPage.errorMessages.passwordRequired");
      IsValide = false;
    } else if (!checkPasswordValidation(formData.password)) {
      passwordError = translate("loginPage.errorMessages.inValidePassword");
      IsValide = false;
    } else {
      passwordError = "";
    }
    setFormDataError((prevState) => ({
      ...prevState,
      username: usernameError,
      password: passwordError,
    }));
    return IsValide;
  };

  const login_api_endpoint = LoginApi;
  const handleLogout = async (sessionUser) => {
    let res = await postDataFromApi(LogOutApi, {
      refresh_token: sessionUser?.refresh_token,
    });
    if (res.data.status === 200) {
      dispatch(logout());
      localStorage.clear();
      localStorage.setItem("user-logged-out", Date.now().toString());
      dispatch(clearSessionAsync());
    } else {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let bodyJson = {
      username: formData.username,
      password: formData.password,
    };

    setActionClicked(true);
    if (!checkValidation()) {
      return false;
    }
    try {
      setIsLoading(true);
      const response = await postDataFromApi(login_api_endpoint, bodyJson, "", "", 1);

      if (response?.data && response?.data?.status === 200) {
        let actualResonse = response.data.data;


        if (actualResonse["2FA"] === "Email" || actualResonse["2FA"] === "Both" || actualResonse["2FA"] === "Phone") {
          localStorage.setItem(
            "LoginData",
            JSON.stringify(actualResonse.userdata)
          );
          localStorage.setItem("username", encryptDataForURL(formData.username));
          localStorage.setItem("tenantId", encryptDataForURL(actualResonse?.tenant_id))
          navigate("/loginOTP");
        } else {
          const role = actualResonse?.logged_in_user_info.role;
          actualResonse.role = role;
          const received_access_token = actualResonse.Access_Token;
          let currentDate = new Date();
          dispatch(loginSuccess(actualResonse));
          /*
       Author : Yash Darshankar
       Date : 03-07-2024
       Description : Adding redux instead of local storage
       */
          dispatch(setSessionAsync(actualResonse));
          //--------------------------------------------------------------------------------
          if (role !== "ADMIN") {
            localStorage.setItem("user-logged-in", Date.now().toString());
            redirectPageAfterLogin(navigate, role);
          } else {
            let sessionUser = response.data.data;
            handleLogout(sessionUser);
            alert(translate("loginPage.nonAdminLogin"));
          }
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

  return (
    <div className="login_page">
      {isLoading && <OverlayLoading />}
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
      {/* <img
        src={tcrcLogo}
        width="181"
        height="48"
        className="tcrcLogo_login"
        alt="logo"
      /> */}
      <form className="login_container" onSubmit={handleSubmit}>
        <h1 className="login_title">{translate("loginPage.loginTitle")}</h1>
        <label htmlFor="username" className="login_container_label">
          {translate("loginPage.employeeId")}
        </label>
        <div className="input_container">
          <img src={user} alt="user" />
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={translate("loginPage.employeeIdPlaceHolder")}
          />
        </div>
        {formDataError.username && actionClicked && (
          <label className="login_container_label_error" htmlFor="username">
            <p className="text-danger errorMsg">{formDataError.username}</p>
          </label>
        )}
        <label htmlFor="password" className="login_container_label">
          {translate("loginPage.password")}
        </label>
        <div className="input_container">
          <img src={lock} alt="lock" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={translate("loginPage.passwordPlaceHolder")}
            title={translate("common.passwordTooltip")}
          />
          {showIcon && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="nonNativeButton"
            >
              <i
                className={
                  !showPassword ? "bi bi-eye h4" : "bi bi-eye-slash h4"
                }
              ></i>
            </button>
          )}
        </div>
        {formDataError.password && actionClicked && (
          <label
            className="login_container_label_error"
            htmlFor="error message"
          >
            <p className="text-danger errorMsg">{formDataError.password}</p>
          </label>
        )}
        <div className="password_options">
          <span></span>
          <Link to="/forgotpassword">
            {translate("loginPage.forgetPasswordLink")}
          </Link>
        </div>
        <br />
        <button type="submit">{translate("loginPage.loginBtn")}</button>
        <div className="version-name">
          <p>{isDevelopments} server version: 1.0</p>
        </div>
      </form>
    </div>
  );
};

export default Login;

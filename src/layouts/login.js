import React, { useEffect, useState } from "react";
import user from "../assets/images/logos/user.png";
import lock from "../assets/images/logos/lock.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postDataFromApi, isDevelopments, GetTenantDetails } from "../services/commonServices";
import { LoginApi, LogOutApi } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../actions/authActions";
import {
  checkPasswordValidation,
  getLogoCondition,
  redirectPageAfterLogin,
} from "../services/commonFunction";
import Sliders from "./Sliders";
import { useTranslation } from "react-i18next";
import { setSessionAsync, clearSessionAsync } from "../reducers/sessionActions";
import OverlayLoading from "../components/common/OverlayLoading";
import { encryptDataForURL } from "../utills/useCryptoUtils";
import tcrcLogoBG from "../assets/images/bg/login_page_bg.png";
import ImageLogo75 from "../assets/images/logos/75ImageLogo.jpeg";

const Login = () => {
  const { t } = useTranslation();
  const translate = t;
  const [showPassword, setShowPassword] = useState(false);
  let isAuthenticated;
  const session = useSelector((state) => state.session);
  isAuthenticated = session.isAuthenticated;

  const [showIcon, setShowIcon] = useState(false);
  const [version, setVersion] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [actionClicked, setActionClicked] = useState(null);
  useEffect(() => {
    dispatch({
      type: "LOGIN_OTP_DATA",
      OTPData: null,
    });
    if (isAuthenticated) {
      navigate("/jrfListing");
    }
  }, []);
  useEffect(() => {
    // Retrieve version number from the meta tag
    const version = document.querySelector('meta[name="version"]')?.content;
    setVersion(version || 'Unknown version');
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

  //handle input value
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
  //Check Validation for login
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
  //Logout function
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

  //handle submit button function for calling login api
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
        // actualResonse['2FA']="Email"
        if (['2FA','Email','Both'].includes(actualResonse["2FA"])) {
          // localStorage.setItem(
          //   "LoginData",
          //   JSON.stringify(actualResonse.userdata)
          // );
          // localStorage.setItem("username", encryptDataForURL(formData.username));
          // localStorage.setItem("tenantId", encryptDataForURL(actualResonse?.tenant_id))
          dispatch({
            type: "LOGIN_OTP_DATA",
            OTPData: {
              LoginData: actualResonse,
              username: formData.username,
              tenantId: actualResonse?.tenant_id,
              timer: 60,
            },
          });
          navigate("/loginOTP");
        } else {
          const role = actualResonse?.logged_in_user_info.role;
          actualResonse.role = role;
          // actualResonse.expiry_time=200
          dispatch(loginSuccess(actualResonse));
          /*
       Author : Yash Darshankar
       Date : 03-07-2024
       Description : Adding redux instead of local storage
       */
          dispatch(setSessionAsync(actualResonse));
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

        {/* <img
          src={tcrcLogoBG}
          width="181"
          height="48"
          className="tcrcLogo_login_bg"
          alt="logo"
        /> */}
        {/* <img
          src={GetTenantDetails().includes('tpbpl') ? getLogoCondition('P') : getLogoCondition('C')}
          width="181"
          height="48"
          className="tcrcLogo_login"
          alt="logo"
        /> */}
        <img
          src={"https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_1_1_29092025_2057.jpeg"}
          width="120"
          className="tcrcLogo_login"
          alt="logo"
        />
        <form className="login_container" onSubmit={handleSubmit}>
          <h1 className="login_title">Welcome !</h1>
          {/* <h1 className="login_title">{translate("loginPage.loginTitle")}</h1> */}

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
            {/* <Link to="/forgotpassword">
              {translate("loginPage.forgetPasswordLink")}
            </Link> */}
          </div>
          <br />
          <div className="loginBtnContainer">

            <button type="submit">{translate("loginPage.loginBtn")}</button>
          </div>
          <div className="version-name">
            <p>{isDevelopments} server version: {version}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

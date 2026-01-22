import React, { useState } from "react";
import user from "../../assets/images/logos/user.png";
import { setForgotPWDToken } from "../../services/localStorageServices";
import { postDataFromApi } from "../../services/commonServices";
import { forgotPasswordApi } from "../../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { encryptDataForURL } from "../../utills/useCryptoUtils";

const Forgotpassword1 = ({ setScreen, data, setData, inputType }) => {
  const { t } = useTranslation();
  const translate = t;
  const [formDataError, setFormDataError] = useState({
    username: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data === "") {
      setFormDataError((prevState) => ({
        ...prevState,
        username: translate(
          "forgotPasswordPage.errorMessages.employeeIdRequired"
        ),
      }));
      return false;
    }
    let bodyToPass;
    bodyToPass = {
      username: data,
    };

    let res = await postDataFromApi(forgotPasswordApi, bodyToPass,"","",1);
    if (res?.data && res.data.status === 200) {
      localStorage.setItem("tenantId",encryptDataForURL(res.data?.data?.tenant_id))
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
      setForgotPWDToken(res.data.token);
      setScreen(3);
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

  const handleOnChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData(value);
    if (value) {
      setFormDataError((prevState) => ({
        ...prevState,
        [name]: translate(
          "forgotPasswordPage.errorMessages.employeeIdRequired"
        ),
      }));
    }
  };

  return (
    <form className="login_container" onSubmit={(e) => handleSubmit(e)}>
      <h1 className="login_title">
        {translate("forgotPasswordPage.forgotPasswordTitle")}
      </h1>

      <label htmlFor="username" className="login_container_label">
        {translate("forgotPasswordPage.employeeIdOremail")}
      </label>
      <div className="input_container">
        <img src={user} alt="user"></img>

        <input
          type="text"
          id="username"
          placeholder={translate(
            "forgotPasswordPage.employeeIdOremailPlaceHolder"
          )}
          value={data}
          onChange={(event) => handleOnChange(event)}
        />
      </div>
      {formDataError.username && (
        <label htmlFor="error message" className="login_container_label_error">
          <p className="text-danger errorMsg">{formDataError.username}</p>
        </label>
      )}
      <div className="password_options">
        <span></span>
        <Link to="/login">{translate("forgotPasswordPage.loginBack")}</Link>
      </div>
      <button type="submit">{translate("forgotPasswordPage.nextBtn")}</button>
    </form>
  );
};

Forgotpassword1.propTypes = {
  setScreen: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  inputType: PropTypes.string.isRequired,
};

export default Forgotpassword1;

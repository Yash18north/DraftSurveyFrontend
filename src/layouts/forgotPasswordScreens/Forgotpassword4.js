import React, { useState } from "react";
import lock from "../../assets/images/logos/lock.png";
import { resetPasswordApi } from "../../services/api";
import { postDataFromApi } from "../../services/commonServices";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import {
  checkPasswordValidation,
  getPasswordVerificationHint,
} from "../../services/commonFunction";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Forgotpassword4 = ({ setScreen ,userName}) => {
  const { t } = useTranslation();
  const translate = t;
  const [newPass, setNewPass] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showIconnew, setShowIconnew] = useState(false);
  const [showIconconfirm, setShowIconconfirm] = useState(false);
  const [actionClicked, setActionClicked] = useState(null);
  const [formDataError, setFormDataError] = useState({
    newPassword: "",
    confirmPassword: "",
  });


  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const handleNewOnchange = (e) => {
    setShowIconnew(e.target.value !== "");
    setNewPass(e.target.value);
  };

  const handleConfirmOnchange = (e) => {
    setShowIconconfirm(e.target.value !== "");
    setConfirmPassword(e.target.value);
  };
  const checkValidation = () => {
    let newPasswordError = "";
    let confirmPasswordError = "";
    let IsValide = true;

    if (newPass === "") {
      newPasswordError = translate(
        "forgotPasswordPage.errorMessages.newpasswordRequired"
      );
      IsValide = false;
    } else if (!checkPasswordValidation(newPass)) {
      newPasswordError = translate(
        "forgotPasswordPage.errorMessages.inValideNewPassword"
      );
      IsValide = false;
    } else {
      newPasswordError = "";
    }
    if (confirmPassword === "") {
      confirmPasswordError = translate(
        "forgotPasswordPage.errorMessages.confirmpasswordRequired"
      );
      IsValide = false;
    } else if (!checkPasswordValidation(confirmPassword)) {
      confirmPasswordError = translate(
        "forgotPasswordPage.errorMessages.inValideconfirmPassword"
      );
      IsValide = false;
    } else if (newPass !== confirmPassword) {
      confirmPasswordError = translate(
        "forgotPasswordPage.errorMessages.notMatchconfirmPassword"
      );
      IsValide = false;
    } else {
      confirmPasswordError = "";
    }
    setFormDataError((prevState) => ({
      ...prevState,
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    }));
    return IsValide;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionClicked(true);
    if (!checkValidation()) {
      return false;
    } else {
      const bodyToPass = {
        password: newPass,
        conf_password: confirmPassword,
        username: userName,
      };
      let res = await postDataFromApi(resetPasswordApi, bodyToPass);
      if (res.data.status === 200) {
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
        setScreen(5);
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
    }
  };
  return (
    <form className="login_container" onSubmit={(e) => handleSubmit(e)}>
      <h1 className="login_title">
        {translate("forgotPasswordPage.forgotPasswordTitle")}
      </h1>

      <h3 className="forgot_password_sub_title">
        {translate("forgotPasswordPage.newPasswordSuggetion")}
      </h3>

      <label htmlFor="new password" className="login_container_label">
        {translate("forgotPasswordPage.newPasswordText")}
      </label>
      <div className="input_container">
        <img src={lock} alt="lock"></img>

        <input
          type={showNewPassword ? "text" : "password"}
          id="password"
          placeholder={translate(
            "forgotPasswordPage.newPasswordTextPlaceHolder"
          )}
          value={newPass}
          onChange={(e) => handleNewOnchange(e)}
          title={translate("common.passwordTooltip")}
        />
        {showIconnew && (
          <button
          type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="nonNativeButton"
          >
            <i
              className={
                !showNewPassword ? "bi bi-eye h4" : "bi bi-eye-slash h4"
              }
            ></i>
          </button>
        )}
      </div>
      {formDataError.newPassword && actionClicked && (
        <label htmlFor="error message" className="login_container_label_error">
          <p className="text-danger errorMsg">{formDataError.newPassword}</p>
        </label>
      )}
      {getPasswordVerificationHint(newPass)}
      <label htmlFor="confirm password" className="login_container_label">
        {translate("forgotPasswordPage.confirmPasswordText")}
      </label>
      <div className="input_container">
        <img src={lock} alt="lock"></img>

        <input
          type={showConfirmPassword ? "text" : "password"}
          id="password"
          placeholder={translate(
            "forgotPasswordPage.confirmPasswordTextPlaceHolder"
          )}
          value={confirmPassword}
          onChange={(e) => handleConfirmOnchange(e)}
          title={translate("common.passwordTooltip")}
        />
        {showIconconfirm && (
          <button
          type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="invisible-button"
          >
            <i
              className={
                !showConfirmPassword ? "bi bi-eye h4" : "bi bi-eye-slash h4"
              }
            ></i>
          </button>
        )}
      </div>
      {formDataError.confirmPassword && actionClicked && (
        <label htmlFor="error message" className="login_container_label_error">
          <p className="text-danger errorMsg">
            {formDataError.confirmPassword}
          </p>
        </label>
      )}
      <button type="submit">
        {translate("forgotPasswordPage.continueBtn")}
      </button>
      <div className="forgot_password_resend">
        <span></span>
        <Link to="/login">{translate("forgotPasswordPage.loginBack")}</Link>
      </div>
    </form>
  );
};
Forgotpassword4.propTypes = {
  setScreen: PropTypes.func,
  userName: PropTypes.string
};

export default Forgotpassword4;

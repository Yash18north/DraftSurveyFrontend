import React, { useState } from "react";
import { postDataFromApi } from "../../services/commonServices";
import { ToastContainer, toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  checkPasswordValidation,
  getPasswordVerificationHint,
} from "../../services/commonFunction";
import { useTranslation } from "react-i18next";

const ChangePasswordModal = ({ setChangePassword }) => {
  const [actionClicked, setActionClicked] = useState(null);
  const { t } = useTranslation();
  const translate = t;
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formDataError, setFormDataError] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formDataIcon, setFormDataIcon] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const handleMouseDown = (type) => {
    setFormDataIcon((prevState) => ({
      ...prevState,
      [type]: !formDataIcon[type],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setTimeout(() => {
      checkValidation();
    }, 10);
  };

  const checkValidation = () => {
    let errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    errors.currentPassword = validatePassword(
      formData.currentPassword,
      "changePasswordPage.errorMessages.currenPasswordRequired",
      "changePasswordPage.errorMessages.inValidecurrenPassword"
    );
    errors.newPassword = validatePassword(
      formData.newPassword,
      "changePasswordPage.errorMessages.newPasswordRequired",
      "changePasswordPage.errorMessages.inValidenewPassword"
    );
    errors.confirmPassword = validateConfirmPassword();

    isValid = Object.values(errors).every((error) => error === "");

    setFormDataError((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return isValid;
  };

  const validatePassword = (password, requiredMessage, invalidMessage) => {
    if (password === "") {
      return translate(requiredMessage);
    } else if (!checkPasswordValidation(password)) {
      return translate(invalidMessage);
    }
    return "";
  };

  const validateConfirmPassword = () => {
    if (formData.confirmPassword === "") {
      return translate(
        "changePasswordPage.errorMessages.ConfirmPasswordRequired"
      );
    } else if (!checkPasswordValidation(formData.confirmPassword)) {
      return translate(
        "changePasswordPage.errorMessages.inValideConfirmPassword"
      );
    } else if (formData.newPassword !== formData.confirmPassword) {
      return translate(
        "changePasswordPage.errorMessages.notMatchconfirmPassword"
      );
    }
    return "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionClicked(true);
    if (!checkValidation()) {
      return false;
    }
    try {
      let payload = {
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
      };

      let res = await postDataFromApi("/users/change-password/", payload);
      if (res.data && res.data.status === 200) {
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

        setTimeout(() => {
          setChangePassword(false);
        }, 500);
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
    } catch (err) {
      toast.error(err.message, {
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
    <div className="popupSearchContainerBG">

      <form
        className="popupSearchContainer popupWidthAdjustment"
        onSubmit={handleSubmit}
      >
        <h2>
          {translate("changePasswordPage.changePasswordTitle")}
          <button
            onClick={() => setChangePassword((prev) => !prev)}
            aria-label="Close"
            className="invisible-button"
          >
            <i className="bi bi-x-lg h4"></i>
          </button>
        </h2>
        <h5>{translate("changePasswordPage.currentPasswordText")}</h5>
        <div className="input_container input_container_changePassword">
          <input
            type={formDataIcon.currentPassword ? "text" : "password"}
            placeholder={translate(
              "changePasswordPage.currentPasswordTextPlaceHolder"
            )}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            title={translate("common.passwordTooltip")}
          />
          <button
            type="button"
            className="nonNativeButton"
            onClick={() => handleMouseDown("currentPassword")}
          >
            <i
              aria-label="Close"
              className={
                !formDataIcon.currentPassword
                  ? "bi bi-eye h4 change-password-eyeicon"
                  : "bi bi-eye-slash h4 change-password-eyeicon"
              }
            ></i>
          </button>
        </div>
        {formDataError.currentPassword && actionClicked && (
          <label
            className="login_container_label_error"
            htmlFor="error message"
          >
            <p className="text-danger errorMsg">
              {formDataError.currentPassword}
            </p>
          </label>
        )}
        <h5>{translate("changePasswordPage.newPasswordText")}</h5>
        <div className="input_container input_container_changePassword">
          <input
            type={formDataIcon.newPassword ? "text" : "password"}
            name="newPassword"
            placeholder={translate(
              "changePasswordPage.newPasswordTextPlaceHolder"
            )}
            value={formData.newPassword}
            onChange={handleChange}
            title={translate("common.passwordTooltip")}
          />
          <button
            type="button"
            className="nonNativeButton"
            onClick={() => handleMouseDown("newPassword")}
          >
            <i
              className={
                !formDataIcon.newPassword
                  ? "bi bi-eye h4 change-password-eyeicon"
                  : "bi bi-eye-slash h4 change-password-eyeicon"
              }
            ></i>
          </button>
        </div>
        {formDataError.newPassword && actionClicked && (
          <label
            htmlFor="error message"
            className="login_container_label_error"
          >
            <p className="text-danger errorMsg">{formDataError.newPassword}</p>
          </label>
        )}
        {getPasswordVerificationHint(formData.newPassword)}
        <h5>{translate("changePasswordPage.confirmPasswordText")}</h5>
        <div className="input_container input_container_changePassword">
          <input
            type={formDataIcon.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder={translate(
              "changePasswordPage.confirmPasswordTextPlaceHolder"
            )}
            value={formData.confirmPassword}
            onChange={handleChange}
            title={translate("common.passwordTooltip")}
          />
          <button
            type="button"
            className="nonNativeButton"
            onClick={() => handleMouseDown("confirmPassword")}
          >
            <i
              className={
                !formDataIcon.confirmPassword
                  ? "bi bi-eye h4 change-password-eyeicon"
                  : "bi bi-eye-slash h4 change-password-eyeicon"
              }
            ></i>
          </button>
        </div>
        {formDataError.confirmPassword && actionClicked && (
          <label
            htmlFor="error message"
            className="login_container_label_error"
          >
            <p className="text-danger errorMsg">
              {formDataError.confirmPassword}
            </p>
          </label>
        )}
        <div className="popupSearchButtonsContainer">
          <div className="popupSearchButtons">
            <button
              type="button"
              onClick={() => setChangePassword((prev) => !prev)}
            >
              {translate("common.cancelBtn")}
            </button>
            <button type="submit">
              {translate("changePasswordPage.saveChangeBtn")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

ChangePasswordModal.propTypes = {
  setChangePassword: PropTypes.func.isRequired,
};

export default ChangePasswordModal;

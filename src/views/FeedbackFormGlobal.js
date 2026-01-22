import React, { useEffect, useState } from "react";
import user from "../assets/images/logos/user.png";
import lock from "../assets/images/logos/lock.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isDevelopments, GetTenantDetails } from "../services/commonServices";
import {
  getLogoCondition,
} from "../services/commonFunction";
import { useTranslation } from "react-i18next";
import OverlayLoading from "../components/common/OverlayLoading";
import tcrcLogoBG from "../assets/images/bg/login_page_bg.png";
import commonFields from "../formJsonData/Feedbacks/FeedbackGlobal.json";
import RenderFields from "../components/common/RenderFields";
import { Row } from "react-bootstrap";
import FeedbackButton from "../components/common/ShowButtons/Feedback/FeedbackButton";
import { isValidPhoneNumber } from "react-phone-number-input";
import Sliders from "../layouts/Sliders";
const Login = () => {
  const [version, setVersion] = useState('');
  const [actionClicked, setActionClicked] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
  });
  const [formErrors, setFormErrors] = useState({});
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const fromType = params.get("from-type")

  useEffect(() => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [0]: {
          ...prevFormData[0],
          fromType:fromType
        },
      };
    });
  }, [fromType])

  const handleChange = (
    sectionIndex,
    fieldName,
    value
  ) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [sectionIndex]: {
          ...prevFormData[sectionIndex],
          [fieldName]: value,
        },
      };
    });
  };

  const handleSubmit = () => {
    setActionClicked(true);

    let errors = {};
    const formDataObject = {};
    Object.entries(formData).forEach(([sectionIndex, fields]) => {
      Object.entries(fields).forEach(([fieldName, fieldValue]) => {
        formDataObject[fieldName] = fieldValue;
      });
    });
    let focusErrName = "";
    let notRequired = [];

    const sectionIndex = 0
    commonFields.fields.forEach((field) => {
      let { required, validation, pattern, type } = field;
      let value = formData[sectionIndex]?.[field.name];
      if (Array.isArray(value)) {
        value = value.join(',')
      }
      value = typeof value === "string" ? value.trim() : value;

      let notRequired = [];
      if (notRequired.includes(field.name)) {
        required = false;
      }
      if (
        required &&
        (!value || value === "") &&
        field.type !== "label" &&
        field.type !== "checkbox" &&
        !field.multiple
      ) {
        if (!focusErrName) {
          focusErrName = field.name;
        }
        errors = {
          ...errors,
          [sectionIndex]: {
            ...errors[sectionIndex],
            [field.label]: validation
              ? validation.message
              : "This field is required",
          },
        };

      } else if (type === "phone") {
        if (value) {
          if (!isValidPhoneNumber(value)) {
            if (!focusErrName) {
              focusErrName = field.name;
            }

            errors = {
              ...errors,
              [sectionIndex]: {
                ...errors[sectionIndex],
                [field.label]: validation
                  ? validation.message
                  : "This field is required",
              },
            };
          }
        }

      }
      else if (type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const regex = new RegExp(emailPattern);
        if (!regex.test(value)) {
          errors = {
            ...errors,
            [sectionIndex]: {
              ...errors[sectionIndex],
              [field.label]: validation
                ? validation.message
                : "This field is required",
            },
          };
        }
      } else if (pattern) {
        if (value) {
          let regex;
          if (type === "tel") {
            regex = /^(?:\+91)?\d{10}$/;
          } else {
            regex = new RegExp(pattern);
          }
          if (!regex.test(value)) {
            if (!focusErrName) {
              focusErrName = field.name;
            }

            errors = {
              ...errors,
              [sectionIndex]: {
                ...errors[sectionIndex],
                [field.label]: validation
                  ? validation.message
                  : "This field is required",
              },
            };
          }
        }
      } else if (
        (field.name === "jrf_terms_and_conditions" &&
          (!value || value === "")) ||
        (field.type === "select" &&
          field.multiple &&
          value &&
          value.length === 0)
      ) {
        if (!focusErrName) {
          focusErrName = field.name;
        }
        errors = {
          ...errors,
          [sectionIndex]: {
            ...errors[sectionIndex],
            [field.name]: validation
              ? validation.message
              : "This field is required",
          },
        };
      }
    });
    if (Object.keys(errors).length === 0) {
      return true;
    } else {
      const errorFieldElement = document.getElementById(`${focusErrName}`);
      if (errorFieldElement) {
        errorFieldElement.focus(); // Focus on the field with the first error
        errorFieldElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }); // Scroll to it
      }
      setFormErrors(errors);
      return false;
    }
  };
  return (
    <div className="login_page_bg">
      {isLoading && <OverlayLoading />}
      <div className="login_page feedbackform">
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
          src={getLogoCondition('C')}
          width="181"
          height="48"
          className="tcrcLogo_login"
          alt="logo"
        /> */}
        <img
          src={'https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_1_1_29092025_2057.jpeg'}
          width="120"
          className="tcrcLogo_login"
          alt="logo"
        />
        <div className="login_container">
          <h1 className="login_title">Feedback Form</h1>
          {/* <h1 className="login_title">{translate("loginPage.loginTitle")}</h1> */}
          <div className="card_header_btns">
            <Row className="main_form">
              {commonFields.fields.map((field, fieldIndex) => {
                return (
                  <div
                    key={"Form-Extra-Adjustments" + fieldIndex}
                    className={"col-md-" + field.width}
                  >

                    <RenderFields
                      field={{
                        ...field,
                        upperClass: "popupUpperClass",
                        fieldWidth: "100"
                      }}
                      sectionIndex={0}
                      fieldIndex={fieldIndex}
                      formData={formData}
                      handleFieldChange={handleChange}
                      setFormData={setFormData}
                      upperClass="popupUpperClass"
                      formErrors={formErrors}
                      actionClicked={actionClicked}
                    />
                  </div>
                )
              })}
              <FeedbackButton
                formData={formData}
                handleSubmit={handleSubmit}
                setFormData={setFormData}
                setActionClicked={setActionClicked}
              />
            </Row>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

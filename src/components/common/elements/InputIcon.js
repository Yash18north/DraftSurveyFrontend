import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import RenderFields from "../RenderFields";

const InputIcon = ({ field }) => {
  const {
    label,
    value,
    handleFieldChange,
    fieldWidth,
    formData,
    headerLength,
    styleName,
    isForOnlyLabel,
    popupJSON,
    fieldIndex
  } = field;

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  // // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="form-group my-2" style={{ position: "relative" }} ref={tooltipRef}>
      {!isForOnlyLabel ? (
        <div
          className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {/* Info Icon */}
          <span
            style={{
              cursor: "pointer",
              fontSize: "18px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <i className="bi bi-info-circle-fill text-danger text-bold"></i>
          </span>

          {/* {showTooltip && (
            <div className="popupSearchContainerBG">
              <div className="inputIcon popupSearchContainer documentPopup documentInfoPopup inputIcon">
                <h2>
                  {popupJSON.title}
                  <i
                    className="bi bi-x-lg h4"
                    onClick={() => setShowTooltip(false)}
                  ></i>
                </h2>
                {popupJSON.fields.map((field, fieldIndex) => (
                  <div
                    key={"Field Index" + fieldIndex}
                    className={"col-md-" + field.width + " uploadRenderFields"}
                  >
                    <RenderFields
                      field={field}
                      customName={field.name + "_" + "0"}
                      sectionIndex={1}
                      fieldIndex={fieldIndex}
                      formData={formData}
                      handleFieldChange={handleFieldChange}
                    // formErrors={formErrors}
                    // viewOnly={viewOnly}
                    // editOnly={editOnly}
                    // actionClicked={actionClicked}
                    />
                  </div>
                ))}

              </div>
            </div>
          )} */}
          {showTooltip &&
            <div className="tooltip-text">
              {value}
            </div>

          }

        </div>
      ) : null}
    </div>
  );
};

InputIcon.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fieldWidth: PropTypes.number,
    headerLength: PropTypes.number,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    styleName: PropTypes.string,
    upperClass: PropTypes.string,
    isForOnlyLabel: PropTypes.bool,
  }).isRequired,
};

export default InputIcon;

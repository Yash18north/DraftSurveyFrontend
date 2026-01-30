import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

const InputFileUpload = ({ field }) => {
    const {
        name,
        label,
        value,
        onChange,
        required,
        error,
        placeholder,
        readOnly,
        pattern,
        actionClicked,
        inputType,
        accept
    } = field;

    const fileInputRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState(false);

    const handleRemoveFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        onChange({ target: { files: [] } });
    };

    return (
        <div className="form-group my-2">
            {label && (
                <label htmlFor={name} style={{ width: "25%" }}>
                    {label}
                    <span className="required_mark">{required ? " *" : null}</span>
                </label>
            )}

            <div className="w-75 d-inline-block mx-2">
                {inputType === "file" ? (
                    <>
                        <div className="d-flex align-items-center gap-2">
                            {
                                !value &&
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id={name}
                                    name={name}
                                    onChange={onChange}
                                    required={required}
                                    className="form-control rounded-2"
                                    readOnly={readOnly}
                                    accept={accept}
                                />
                            }


                            {/* ❌ Cancel icon and Slected File */}
                            <div className="uploadFileInInputField"
                            
                              >
                                {value?.name && (
                                    <p className="text-muted small mt-1">
                                        Selected file: {value.name}
                                    </p>
                                )}
                                {value && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm uploadCanceLbTN"
                                        onClick={handleRemoveFile}
                                        title="Remove file"
                                    >
                                       <span>✕</span>
                                    </button>
                                )}
                            </div>
                        </div>

                    </>
                ) : (
                    <input
                        type="text"
                        id={name}
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        required={required}
                        className="form-control rounded-2"
                        placeholder={placeholder}
                        readOnly={readOnly}
                        maxLength={13}
                        pattern={pattern}
                    />
                )}

                {error && actionClicked && (
                    <p className="text-danger">{error}</p>
                )}
            </div>
        </div>
    );
};

InputFileUpload.propTypes = {
    field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        required: PropTypes.bool,
        error: PropTypes.string,
        placeholder: PropTypes.string,
        readOnly: PropTypes.bool,
        pattern: PropTypes.string,
        actionClicked: PropTypes.bool,
        inputType: PropTypes.string,
        accept: PropTypes.string
    }).isRequired,
};

export default InputFileUpload;

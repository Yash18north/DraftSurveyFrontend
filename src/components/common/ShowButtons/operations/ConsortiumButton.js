import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import React from "react";
import PropTypes from 'prop-types';
import { handleConsortiumValidation } from "../../commonHandlerFunction/operations/consortiumHandlerFunctions";
const ConsortiumButton = ({ setIsPopupOpen, setJRFCreationType, handleSubmit, viewOnly, handleBackButtonFunction }) => {
    const { t } = useTranslation();
    const translate = t;
    return (
        <div className="submit_btns">
            <React.Fragment>
                <Button
                    type="button"
                    className="cancelBtn"
                    id="submit_btn3"
                    onClick={() => {
                        handleBackButtonFunction()
                    }}
                >
                    {translate("common.backBtn")}
                </Button>
                {!viewOnly && <>
                    <button
                        type="button"
                        className="saveBtn"
                        id="submit_btn2"
                        data-name="save"
                        onClick={(e) =>
                            handleConsortiumValidation(
                                handleSubmit,
                                setJRFCreationType,
                                setIsPopupOpen,
                                "save"
                            )
                        }
                    >
                        {translate("common.saveBtn")}
                    </button>
                    <Button
                        type="button"
                        className="submitBtn"
                        id="submit_btn1"
                        onClick={(e) =>
                            handleConsortiumValidation(
                                handleSubmit,
                                setJRFCreationType,
                                setIsPopupOpen,
                                "post"
                            )
                        }
                    >
                        {translate("common.postBtn")}
                    </Button>
                </>}
            </React.Fragment>

        </div>
    );
};


ConsortiumButton.propTypes = {
    setIsPopupOpen: PropTypes.func,
    setJRFCreationType: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleBackButtonFunction: PropTypes.func,
    viewOnly: PropTypes.bool,
};

export default ConsortiumButton;

import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import React from "react";
import PropTypes from 'prop-types';
import { handleInvoiceCreateOrUpdate, handleDebitCreate } from "../../commonHandlerFunction/InvoiceHandlerFunctions";
import { useLocation } from "react-router-dom";
import { decryptDataForURL } from "../../../../utills/useCryptoUtils";

const InvoiceButton = ({
    setIsPopupOpen,
    setJRFCreationType,
    viewOnly,
    navigate,
    formData,
    formConfig,
    setIsOverlayLoader,
    setFormData,
    setTabOpen,
    subTableData,
    handleSubmit,
    setIsRejectPopupOpen,
    setIsCancelPopupOpen,
    masterResponse,
    user
}) => {
    const { t } = useTranslation();
    const translate = t;
    let useFor = "button";

    const location = useLocation();
    const conditionForDebit = location.pathname.includes("/operation/invoice-listing/create-debit")

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    return (
        <div className="submit_btns">
            <React.Fragment>
                <Button
                    type="button"
                    className="cancelBtn"
                    id="submit_btn3"
                    onClick={() => {
                        navigate("/operation/invoice-listing")
                    }}
                >
                    {translate("common.backBtn")}
                </Button>
                {!viewOnly && !decryptDataForURL(params.get("isCourier")) && <>
                    {!conditionForDebit && <>
                        <button
                            type="button"
                            className="saveBtn"
                            id="submit_btn2"
                            data-name="save"
                            onClick={() => {
                                handleInvoiceCreateOrUpdate(
                                    formData,
                                    formConfig,
                                    setIsOverlayLoader,
                                    setIsPopupOpen,
                                    "save",
                                    navigate,
                                    setFormData,
                                    setTabOpen,
                                    useFor,
                                    masterResponse,
                                    handleSubmit,
                                    [],
                                    user
                                )
                                // navigate("/operation/invoice-listing")
                            }}
                        >
                            {translate("common.saveBtn")}
                        </button>
                        <Button
                            type="button"
                            className="submitBtn"
                            id="submit_btn1"
                            // disabled={checkValidation('post')}
                            onClick={(e) =>
                            // handleInvoiceCreateOrUpdate(
                            //     formData,
                            //     formConfig,
                            //     setIsOverlayLoader,
                            //     setIsPopupOpen,
                            //     "post",
                            //     navigate,
                            //     setFormData,
                            //     setTabOpen,
                            //     useFor,
                            //     masterResponse,
                            //     handleSubmit
                            // )
                            {
                                let isValidate = handleSubmit();
                                if (!isValidate) {
                                    return false;
                                }
                                setJRFCreationType('post');
                                setIsPopupOpen(true);
                            }
                            }
                        >
                            {translate("common.postBtn")}
                        </Button>
                    </>}
                    {conditionForDebit &&
                        <>
                            <button
                                type="button"
                                className="saveBtn"
                                id="submit_btn2"
                                data-name="save"
                                onClick={() => {
                                    handleDebitCreate(
                                        formData,
                                        formConfig,
                                        setIsOverlayLoader,
                                        setIsPopupOpen,
                                        "save",
                                        navigate,
                                        setFormData,
                                        setTabOpen,
                                        useFor,
                                        masterResponse,
                                        handleSubmit,
                                        subTableData,
                                        user
                                    )
                                    // navigate("/operation/invoice-listing")
                                }}
                            >
                                Save Debit
                            </button>
                            <button
                                type="button"
                                className="submitBtn"
                                id="submit_btn2"
                                data-name="save"
                                onClick={() => {
                                    handleDebitCreate(
                                        formData,
                                        formConfig,
                                        setIsOverlayLoader,
                                        setIsPopupOpen,
                                        "save",
                                        navigate,
                                        setFormData,
                                        setTabOpen,
                                        useFor,
                                        masterResponse,
                                        handleSubmit,
                                        subTableData,
                                        user,
                                        "Posted"
                                    )
                                    // navigate("/operation/invoice-listing")
                                }}
                            >
                                Post Debit
                            </button>
                        </>
                    }


                </>}
                {
                    decryptDataForURL(params.get("isCourier")) && (<Button
                        type="button"
                        className="submitBtn"
                        id="submit_btn1"
                        // disabled={checkValidation('post')}
                        onClick={(e) => {
                            handleInvoiceCreateOrUpdate(
                                formData,
                                formConfig,
                                setIsOverlayLoader,
                                setIsPopupOpen,
                                formData[0]?.im_status,
                                navigate,
                                setFormData,
                                setTabOpen,
                                useFor,
                                masterResponse,
                                handleSubmit,
                                [],
                                user
                            )
                        }}
                    >
                        Save
                    </Button>)
                }
            </React.Fragment>

        </div >
    );
};


InvoiceButton.propTypes = {
    setIsPopupOpen: PropTypes.func,
    setJRFCreationType: PropTypes.func,
    handleBackButtonFunction: PropTypes.func,
    viewOnly: PropTypes.bool,
};

export default InvoiceButton;

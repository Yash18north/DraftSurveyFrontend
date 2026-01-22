import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { handleSupplierCreateUpdate } from '../../../commonHandlerFunction/Purchase/Supplier/SupplierHandler'

const SupplierButtons = ({
    formData,
    handleSubmit,
    setIsOverlayLoader,
    setFormData,
    viewOnly
}) => {
    const navigate = useNavigate()
    return (
        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/supplierList")}
            >
                Back
            </Button>

            {/* // formData[0]?.id ?
                    // <Button
                    //     type="button"
                    //     className="submitBtn"
                    //     onClick={() =>
                    //         navigate("/")
                    //     }
                    // >
                    //     Send for Approval
                    // </Button>
                    // : */}
            <>
                {
                    !viewOnly && (
                        <>
                            <Button
                                type="button"
                                className="submitBtn"
                                onClick={() =>
                                    handleSupplierCreateUpdate(
                                        formData,
                                        handleSubmit,
                                        setIsOverlayLoader,
                                        navigate,
                                        "saved"
                                    )
                                }
                            >
                                Save
                            </Button>
                            {formData[0]?.sup_status == 0 &&
                                <Button
                                    type="button"
                                    className="saveBtn"
                                    onClick={() =>
                                        handleSupplierCreateUpdate(
                                            formData,
                                            handleSubmit,
                                            setIsOverlayLoader,
                                            navigate,
                                            "posted"
                                        )
                                    }
                                >
                                    Post
                                </Button>
                            }

                        </>
                    )
                }

            </>



        </div>
    )
}

export default SupplierButtons
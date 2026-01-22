import React from "react";
import {
    Row,
} from "react-bootstrap";
import PropTypes from 'prop-types';
const SampleVerificationDetals = ({ setIsViewOpen, viewTableData }) => {
    return (
        <div className="popupSearchContainerBG">
            <div className="popupInwardModal popupWidthAdjustmentParamDetails sampleverification-popup">
                <div className="rejectSearchCross">
                    <button
                        onClick={() => setIsViewOpen(false)}
                        className="nonNativeButton2"
                        aria-label="Reject Button"
                    >
                        <i className="bi bi-x-lg h4"></i>
                    </button>
                </div>
                <Row className="autoWidthImportant sampleverification-table">
                    <h2 className="modalHeader">Parameter Details</h2>
                    <table className="table table-white responsive borderless no-wrap mt-3 align-middle renderTable">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Parameter</th>
                                <th>Test Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                viewTableData && viewTableData.map((singleData, rowIndex) => (<tr key={"rowIndex" + rowIndex} className="border-top">
                                    <td>{rowIndex + 1}</td>
                                    <td>{singleData.param_name}</td>
                                    <td>{singleData.standard_name}</td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Row>
                <div className="popupInwardButtonsContainer">
                    <div className="popupSearchButtons">
                        <button type="button" onClick={() => setIsViewOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
SampleVerificationDetals.propTypes = {
    setIsViewOpen: PropTypes.func,
    viewTableData: PropTypes.array // Adjust if you know the structure of the array
  };
export default SampleVerificationDetals;

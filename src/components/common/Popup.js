import React from "react";
import { Modal, Card, CardBody, Row } from "react-bootstrap";
import RenderFields from "./RenderFields";
import PropTypes from "prop-types";

const Popup = ({
  setShowModal,
  showModal,
  tab,
  sectionIndex,
  formData,
  handleFieldChange,
  formErrors,
  moduleType
}) => {
  const toggleModal = () => {
    setShowModal(false);
  };

  return (
   
      <Modal show={showModal} onHide={toggleModal} scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Row</Modal.Title>
        </Modal.Header >
        <Modal.Body className={`${moduleType === "purchaseReq" ? "purchasereq_popup_body" : "popup_body"}  `}>
          <div className="my-2 bg-white">
            <Card>
              <CardBody>
                <Row>
                  {tab?.headers?.map((field, fieldIndex) => (
                    <div
                      className={"col-md-" + field.width}
                      key={"Headers-" + fieldIndex}
                    >
                      <RenderFields
                        field={field}
                        sectionIndex={sectionIndex}
                        fieldIndex={fieldIndex}
                        formData={formData}
                        handleFieldChange={handleFieldChange}
                        formErrors={formErrors}
                      />
                    </div>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              toggleModal();
            }}
            className="my-2 btn-danger btn btn-secondary btn-sm"
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
   
      
  );
};

Popup.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  tab: PropTypes.object.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
};

export default Popup;

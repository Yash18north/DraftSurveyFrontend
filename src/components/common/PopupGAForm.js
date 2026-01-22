import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import InputMultiSelect2 from "./elements/InputMultiSelect2";
import PropTypes from 'prop-types';

const Popup = ({ showModalGA, setShowModalGA, options, staticData }) => {
  const [popupData, setPopupData] = useState([]);


  const toggleModal = () => {
    setShowModalGA(false);
  };

  useEffect(() => {
    const dataFromLocalStorage = localStorage.getItem("allData") || "[]";
    const jsonData = JSON.parse(dataFromLocalStorage);
    setPopupData(jsonData);
  }, []);





  return (
    <Modal show={showModalGA} onHide={toggleModal} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body className="popup_body">
        {popupData.map((item, index) => (
          <div key={"popupData-"+index} style={{padding:"32px"}}>
            {Object.entries(item).map(([key, value]) => (
              <InputMultiSelect2
                key={key} 
                field={{
                  name: key, 
                  label: key, 
                  options: value,
            


                  popupData: popupData,
                  sectionIndex: index,
                }}
              />
            ))}

         
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};


Popup.propTypes = {
  showModalGA: PropTypes.bool.isRequired,
  setShowModalGA: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  staticData: PropTypes.object.isRequired,
};

export default Popup;

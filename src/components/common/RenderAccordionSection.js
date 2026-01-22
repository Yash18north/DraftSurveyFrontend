import React from "react";
import RenderFields from "./RenderFields";
import { Accordion } from "react-bootstrap";
import PropTypes from 'prop-types';

const RenderAccordionSection = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,
  formErrors,
}) => {


  return (
    <div key={sectionIndex}>
      <h3 className="text-start">{section.title}</h3>
      <Accordion>
        {section?.panels?.map((panel, panelIndex) => (
          <Accordion.Item
            className={"accordion-item"}
            key={"panelIndex-"+panelIndex}
            eventKey={panelIndex.toString()}
          >
            <Accordion.Header>{panel.label}</Accordion.Header>
            <Accordion.Body className="row">
              {panel.fields.map((field, fieldIndex) => (
                <div key={"fieldIndex"+fieldIndex} className={"col-md-" + field.width}>
                  <RenderFields
                    field={field}
                    sectionIndex={sectionIndex}
                    fieldIndex={panelIndex * 100 + fieldIndex}
                    formData={formData}
                    handleFieldChange={handleFieldChange}
                    formErrors={formErrors}
                  />
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

RenderAccordionSection.propTypes = {
  section: PropTypes.object.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
};

export default RenderAccordionSection;

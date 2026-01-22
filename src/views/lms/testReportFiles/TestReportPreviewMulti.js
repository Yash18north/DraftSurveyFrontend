import React from "react";
import { GetTenantDetails } from "../../../services/commonServices";
import PropTypes from "prop-types";

const TestReportPreviewMulti = ({
  minValue,
  maxValue,
  basisNames,
  paramValues,
  standardValues,
  basisValues,
  mainIndex,
  samplecodes,
  paramDetailsValues,
  responsedata
}) => {
  const getBasisValue = (samples, paramname, basis) => {
    let value = "-";
    const filteredsamples = samples.filter((singleparam) => {
      return singleparam.param_detail.param_name == paramname;
    });
    if (filteredsamples.length > 0) {
      const basisDetails = filteredsamples[0].basis_detail.filter(
        (singlebasis) => {
          return singlebasis.spbr_basiscode === basis;
        }
      );
      if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1))) {
        value = basisDetails.length > 0 ? basisDetails[0].spbr_sfm_input_type_value : "-";
      }
      else {
        value = basisDetails.length > 0 ? basisDetails[0].spbr_lcvalue : "-";
      }

    }
    return value;
  };
  let ActualParamLength = 0
  paramValues[mainIndex].map(
    (param, index) => {
      if (index >= minValue &&
        index <= maxValue) {
        ActualParamLength = ActualParamLength + paramDetailsValues[mainIndex][index].basis_detail.length
      }

    })
  let isUnitExists = false;
  standardValues[mainIndex].map(
    (param, index) => {

      if (index >= minValue && index <= maxValue && paramDetailsValues[mainIndex][index].sp_param_unit) {
        isUnitExists = true;
      }
    }
  )
  const rowSpan = isUnitExists ? 5 : 4
  return (
    <table cellPadding={1} cellSpacing={0} className="first_td">
      <tbody>
        <tr>
          <td rowSpan={rowSpan} className="first_td">
            Test Report Number
          </td>
          <td rowSpan={rowSpan} className="first_td">
            Mark & seal
          </td>
          <td colSpan={ActualParamLength} className="first_td">
            Parameters, Basis, Standards & Units
          </td>
        </tr>
        <tr>
          {paramValues[mainIndex].map(
            (param, index) =>
              index >= minValue &&
              index <= maxValue && (
                <>
                  <td
                    className="first_td"
                    colSpan={
                      paramDetailsValues[mainIndex][index].basis_detail.length
                    }
                  >
                    {param}
                  </td>
                </>
              )
          )}
        </tr>
        <tr>
          {GetTenantDetails(1, 1) != "TPBPL" && paramDetailsValues[mainIndex].map(
            (paramValues, index) =>
              index >= minValue &&
              index <= maxValue &&
              paramValues.basis_detail.map((newparam) => (
                <td className="first_td">{newparam.spbr_basiscode}</td>
              ))
          )}
        </tr>
        <tr>
          {standardValues[mainIndex].map(
            (param, index) =>
              index >= minValue &&
              index <= maxValue && (
                <>
                  <td
                    className="first_td"
                    colSpan={
                      paramDetailsValues[mainIndex][index].basis_detail.length
                    }
                  >
                    {param}
                  </td>
                </>
              )
          )}
        </tr>
        <tr>
          {standardValues[mainIndex].map(
            (param, index) =>
              index >= minValue &&
              index <= maxValue && isUnitExists && (
                <>
                  <td
                    className="first_td"
                    colSpan={
                      paramDetailsValues[mainIndex][index].basis_detail.length
                    }
                  >
                    {
                      paramDetailsValues[mainIndex][index].sp_param_unit ?? "-"
                    }
                  </td>
                </>
              )
          )}
        </tr>
        {samplecodes[mainIndex].map((sampleData, index) => (
          <tr>
            <td className="second_td">{sampleData.sample_code}</td>
            <td className="second_td">
              {
                `${responsedata.ic_is_mark || responsedata.ic_is_seal ? (responsedata.ic_is_mark ? sampleData.sample_mark + '-' : '') + (responsedata.ic_is_seal ? sampleData.sample_seal : '') : '-'}`
              }
              {/* {sampleData.sample_mark}
              {sampleData.sample_seal ? "-" + sampleData.sample_seal : ""} */}
            </td>

            {paramDetailsValues[mainIndex].map(
              (paramValues, index) =>
                index >= minValue &&
                index <= maxValue &&
                paramValues.basis_detail.map((newparam) => (
                  <td className="first_td">
                    {getBasisValue(
                      sampleData.sample_params,
                      paramValues.param_detail.param_name,
                      newparam.spbr_basiscode
                    )}
                  </td>
                ))
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
TestReportPreviewMulti.propTypes = {
  minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  basisNames: PropTypes.arrayOf(PropTypes.string),
  paramValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  standardValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  basisValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  mainIndex: PropTypes.number,
  samplecodes: PropTypes.arrayOf(PropTypes.string),
  paramDetailsValues: PropTypes.arrayOf(PropTypes.object),
};
export default TestReportPreviewMulti;

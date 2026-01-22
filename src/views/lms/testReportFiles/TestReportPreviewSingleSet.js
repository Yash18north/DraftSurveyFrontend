import React from "react";
import { GetTenantDetails } from "../../../services/commonServices";
import PropTypes from "prop-types";

const TestReportPreviewSingleSet = ({
  samplecodes,
  mainIndex,
  paramValues,
  minValue,
  maxValue,
  basisNames,
  standardValues,
  basisValues,
  paramDetailsValues,
}) => {
  
  return (
    <table cellPadding={1} cellSpacing={0} className="first_td">
      <thead>
        <tr>
          <th className="first_td">Parameters</th>
          {GetTenantDetails(1, 1) != "TPBPL" && (
            <th className="first_td">Basis</th>
          )}
          <th className="first_td">Value</th>
          <th className="first_td">UOM</th>
          <th className="first_td">Test Method</th>
        </tr>
      </thead>
      <tbody>
        {paramValues[mainIndex].map((singleParam, paramIndex) => {
          let isFirstValue = 1;
          return (
            paramIndex >= minValue &&
            paramIndex <= maxValue && (
              <>
                <tr>
                  <td
                    rowSpan={
                      paramDetailsValues[mainIndex][paramIndex]["basis_detail"]
                        .length + 1
                    }
                    className="second_td"
                  >
                    {singleParam}
                  </td>
                </tr>
                {basisNames[mainIndex].map((basis, index2) => {
                  let filterBase = paramDetailsValues[mainIndex][paramIndex][
                    "basis_detail"
                  ].filter((singlebase) => basis == singlebase.spbr_basiscode);
                  let basisValue = "";
                  if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1))) {
                    basisValue =
                      filterBase.length > 0
                        ? filterBase[0].spbr_sfm_input_type_value
                          ? filterBase[0].spbr_sfm_input_type_value
                          : "0"
                        : "";
                  } else {
                    basisValue =
                      filterBase.length > 0
                        ? filterBase[0].spbr_lcvalue
                          ? filterBase[0].spbr_lcvalue
                          : "0"
                        : "";
                  }
                  const isFirst = isFirstValue;
                  if (basisValue) {
                    isFirstValue = 0;
                  }
                  return (
                    basisValue && (
                      <tr>
                        {basisValue && (
                          <>
                            {GetTenantDetails(1, 1) != "TPBPL" && (
                              <td className="second_td">{basis}</td>
                            )}
                            <td className="second_td">{basisValue}</td>
                          </>
                        )}
                        {isFirst === 1 && (
                          <>
                            <td
                              className="second_td"
                              rowSpan={
                                paramDetailsValues[mainIndex][paramIndex][
                                  "basis_detail"
                                ].length + 1
                              }
                            >
                              {
                                paramDetailsValues[mainIndex][paramIndex]
                                  .sp_param_unit
                              }
                            </td>

                            <td
                              rowSpan={
                                paramDetailsValues[mainIndex][paramIndex][
                                  "basis_detail"
                                ].length + 1
                              }
                              className="second_td"
                            >
                              {standardValues[mainIndex][paramIndex]}
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  );
                })}
              </>
            )
          );
        })}
      </tbody>
    </table>
  );
};
TestReportPreviewSingleSet.propTypes = {
  samplecodes: PropTypes.arrayOf(PropTypes.string),
  mainIndex: PropTypes.number,
  paramValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  basisNames: PropTypes.arrayOf(PropTypes.string),
  standardValues: PropTypes.arrayOf(PropTypes.number),
  basisValues: PropTypes.arrayOf(PropTypes.number),
  paramDetailsValues: PropTypes.arrayOf(
    PropTypes.shape({
      // Define the shape of each object in the array if necessary
      // For example:
      // name: PropTypes.string,
      // value: PropTypes.number
    })
  ),
};
export default TestReportPreviewSingleSet;

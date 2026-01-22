import React, { useEffect } from "react";
import InputText from "./elements/InputText";
import InputDoubleText from "./elements/InputDoubleText";
import InputTextArea from "./elements/InputTextArea";
import InputTextAreaEditor from "./elements/InputTextAreaEditor";
import InputLabel from "./elements/InputLabel";
import InputIcon from "./elements/InputIcon";
import InputDate from "./elements/InputDate";
import InputEmail from "./elements/InputEmail";
import InputMobile from "./elements/InputMobile";
import InputPassword from "./elements/InputPassword";
import InputRadio from "./elements/InputRadio";
import InputCheckbox from "./elements/InputCheckbox";
import InputSelect from "./elements/InputSelect";
import InputMultiSelect from "./elements/InputMultiSelect";
import InputNumber from "./elements/InputNumber";
import InputPhone from "./elements/InputPhone";
import InputNumberPlusMinus from "./elements/InputNumPlusMin";
import DateTimePicker from "./elements/InputDatetime";
import HorizontalLine from "./elements/horizontalLine";
import Preview from "./elements/Preview";
import CustomInput from "./elements/CustomInput";
import CustomInput2 from "./elements/CustomInput2";
import InputSelectMultiwithCheckbox from "./elements/InputSelectMultiwithCheckbox";
import PropTypes from "prop-types";
import InputSelectwithSearch from "./elements/InputSelectwithSearch";
import { getFormatedDate } from "../../services/commonFunction";
import DropDownWithLoadMore from "./elements/DropDownWithLoadMore";
import InputTime from "./elements/InputTime";
import InputMultiEmail from "./elements/InputMultiEmail";
import InputTimePicker from "./elements/InputTimePicker";

const RenderFields = ({
  field,
  sectionIndex,
  fieldIndex,
  formData,
  handleFieldChange,
  formErrors,
  GAData,
  setGAData,
  showModalGA,
  setShowModalGA,
  masterOptions,
  viewOnly,
  customName,
  renderTable,
  actionClicked,
  from,
  centerAlign,
  isStaticValue,
  exludeOptions,
  handleFieldBlur,
  isViewLabel,
  upperClass,
  tooltipTrue,
  pdfUrl,
  setPdfUrl,
  sharingPdfUrl,
  IsPreviewUpload,
  setSharingPdfUrl,
  specialType,
  isSubCheckbox,
  disabledMarks,
  hasSelectAll,
  setFormData,
  isNoLabel,
  sequence,
  moduleType,
  isEditMode,
  defaultValue,
}) => {
  let newFieldName = "";
  if (customName) {
    newFieldName = customName;
  } else {

    newFieldName = field.name;
  }

  let { type, validation, name, value } = field;
  let newFieldValue = "";
  if (type === "date") {
    newFieldValue = formData[sectionIndex]?.[newFieldName]
      ? getFormatedDate(formData[sectionIndex]?.[newFieldName], 1)
      : "";
  }

  type =
    viewOnly && !["doubleText", "textArea", "preview", 'date', 'textAreaEditor'].includes(type)
      ? isNoLabel ? type : "label"
      : type;
  if (type === "date") {
    if (viewOnly) {
      field.readOnly = true
    }
    // else {
    //   field.readOnly = false
    // }
  }
  type = name === "sa_sampleallottedto" ? "select" : type;

  if (["sa_sampleallottedto"].includes(name)) {
    if (viewOnly) {
      field.readOnly = true
    }
    else {
      field.readOnly = false
    }
  }
  if (['ic_mark_and_seal_qualifier'].includes(name)) {
    if (viewOnly) {
      type = "text"
      field.readOnly = true
    }
    else {
      field.readOnly = false
    }
  }
  type = [
    "jrf_vc_term_condition",
    "jrf_terms_and_conditions",
    "non_scope",
  ].includes(name)
    ? "checkbox"
    : type;
  type = name == "ic_smpldrawnbylab" ? "radio" : type;
  field.label = from === "Table" ? "" : field.label;
  if (field.name === "smpl_detail_recpt_mode" && field.readOnly) {
    type = "label";
  }
  if (field.useForViewOnly) {
    type = field.type;
    field.readOnly = field.readOnly || viewOnly
  }
  if (field.isViewTimeText && field.readOnly) {
    type = "label";
    field.readOnly = viewOnly
  }
  // else if (field.type === "text") {
  //   type = field.type;
  //   field.readOnly = field.readOnly || viewOnly
  // }
  useEffect(() => {
    if (viewOnly) {
      if (!value) {
        value = "--";
      }
    }
  }, []);
  field.centerAlign = centerAlign;
  const showError = formErrors?.[sectionIndex]?.[fieldIndex];
  const getLabelValue = () => { };
  switch (type) {

    case "text":
      return (
        <InputText
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e, isValue) => {
              if (field.Capitalize) {
                handleFieldChange(sectionIndex, newFieldName, isValue ? e.toUpperCase() : e.target.value.toUpperCase());
              }
              else {
                handleFieldChange(sectionIndex, newFieldName, isValue ? e : e.target.value);
              }

            },
            handleFieldBlur: handleFieldBlur
              ? (e) => {
                e.target.value = e.target.value.trim()
                handleFieldBlur(
                  sectionIndex,
                  newFieldName,
                  field.Capitalize ? e.target.value.toUpperCase() : e.target.value
                )
              }
              : null,
            required: field.required,
            errorMessage: showError ? validation.message : "",
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: tooltipTrue ? value : field.tooltip,
            characterLimit: field.characterLimit,
            validation: validation,
            icon: field.icon,
            styleName: field.styleName,
            fieldWidth: field.fieldWidth,
            pattern: field.pattern,
            renderTable: renderTable,
            actionClicked: actionClicked,
            upperClass: upperClass,
            from: from,
            isPatternMessage: field.isPatternMessage,
            defaultValue: field.defaultValue,
            allProps: field
          }}
        />
      );
    case "doubleText":

      return (
        <InputDoubleText

          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange1: (e, isValue) => {
              let value = isValue ? e : e.target.value
              if (["number"].includes(field.firstType, field.type)) {
                if (field.isOnlyNumber) {
                  const numberPattern = /^\d*$/;
                  if (!numberPattern.test(value)) {
                    value = parseInt(value)
                  }
                }
              }
              handleFieldChange(sectionIndex, newFieldName, value);
            },

            onChange2: (e, isValue) => {
              handleFieldChange(sectionIndex, field.secondName, isValue ? e : e.target.value);
            },
            onChange3: (e) => {
              handleFieldChange(
                sectionIndex,
                field.thirdName,
                e.target.checked
              );
            },
            onBlur1: (e) =>
              handleFieldBlur
                ? handleFieldBlur(sectionIndex, newFieldName, e.target.value)
                : null,
            onBlur2: (e, isValue) =>
              handleFieldBlur
                ? handleFieldBlur(
                  sectionIndex,
                  field.secondName,
                  isValue ? e : e.target.value
                )
                : null,
            required: field.required,
            errorMessage: showError ? validation.message : "",
            placeholder: field.placeholder,
            readOnly: field.readOnly || viewOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            validation: validation,
            icon: field.icon,
            fieldWidth: field.fieldWidth,
            upperFieldWidth: field.upperFieldWidth,
            pattern: field.pattern,
            renderTable: renderTable,
            actionClicked: actionClicked,
            secondName: field.secondName,
            secondReadOnly: field.secondReadOnly,
            restrictByCheckbox: field.restrictByCheckbox,
            upperClass: field.upperClass,
            isShowRadioBefore: field.isShowRadioBefore,
            setFormData: setFormData,
            secondValue: formData[sectionIndex]?.[field.secondName] || "",
            thirdValue: field.thirdValue
              ? field.thirdValue
              : formData[sectionIndex]?.[field.thirdName] || "",
            thirdName: field.thirdName,
            firstType: field.firstType,
            secondType: field.secondType,
            secondoptions: field.secondoptions,
            thirdType: field.thirdType,
            viewOnly: viewOnly,
            secondPlaceholder: field.secondPlaceholder,
            sectionIndex: sectionIndex,
            fieldIndex: fieldIndex,
            formData: formData,
            labelWidth: field.labelWidth,
            showTimeSelect: field.showTimeSelect,
            minDate: field.minDate,
            naValuenotNeeded: field.naValuenotNeeded,
            secondFieldWidth: field.secondFieldWidth,
            defaultSecondValue: field.secondValue,
            dropdownWidth: field.dropdownWidth,
            allProps: field,
            upperClass: upperClass,
          }}
          actualField={field}
          sectionIndex={sectionIndex}
          fieldIndex={fieldIndex}
          formData={formData}
          handleFieldChange={handleFieldChange}
          formErrors={formErrors}
        />
      );
    case "textArea":
      return (
        <InputTextArea
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e, isValue) =>
              handleFieldChange(sectionIndex, newFieldName, isValue ? e : e.target.value),

            required: field.required,
            errorMessage: showError ? validation.message : "",
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            validation: validation,
            icon: field.icon,
            fieldWidth: field.fieldWidth,
            labelWidth: field.labelWidth,
            pattern: field.pattern,
            actionClicked: actionClicked,
            upperClass: upperClass,
            viewOnly: viewOnly,
            inputHeight: field.inputHeight,
            defaultValue: field.defaultValue
          }}
        />
      );

    case "textAreaEditor":
      return (
        <InputTextAreaEditor
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e),
            required: field.required,
            errorMessage: showError ? validation.message : "",
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            validation: validation,
            icon: field.icon,
            fieldWidth: field.fieldWidth,
            labelWidth: field.labelWidth,
            pattern: field.pattern,
            defaultValue: field.defaultValue,
            actionClicked: actionClicked,
            viewOnly: viewOnly || field.isDisabledField,
          }}
        />
      );
    case "label":
      return (
        <InputLabel
          key={newFieldName}
          field={{
            fontSize: field.fontSize,
            headerLength: field.headerLength,
            textDecoration: field.textDecoration,
            color: field.color,
            name: newFieldName,
            label: field.label,
            value: !isStaticValue
              ? newFieldValue
                ? newFieldValue
                : formData[sectionIndex]?.[newFieldName] ||
                  formData[sectionIndex]?.[newFieldName] === 0
                  ? formData[sectionIndex]?.[newFieldName]
                  : field.value
              : field.value,
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "",
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: tooltipTrue
              ? !isStaticValue
                ? newFieldValue
                  ? newFieldValue
                  : formData[sectionIndex]?.[newFieldName] || field.value
                : field.value
              : field.tooltip,
            characterLimit: field.characterLimit,
            validation: validation,
            icon: field.icon,
            fieldWidth: field.fieldWidth,
            styleName: field.styleName,
            actionClicked: actionClicked,
            centerAlign: centerAlign,
            upperClass: upperClass || field.upperClass,
            isForOnlyLabel: field.isForOnlyLabel,
            isCopy: field.isCopy,
          }}
        />
      );
    case "number":
      return (
        <InputNumber
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] != null ? formData[sectionIndex][newFieldName] : '',
            onChange: (e, isValue) =>
              // handleFieldChange(sectionIndex, newFieldName, e.target.value, e.target.type),
              handleFieldChange(sectionIndex, newFieldName, isValue ? e : e.target.value, isValue ? 'number' : e.target.type),
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputNumber component
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: tooltipTrue
              ? !isStaticValue
                ? newFieldValue
                  ? newFieldValue
                  : formData[sectionIndex]?.[newFieldName] || field.value
                : field.value
              : field.tooltip,
            characterLimit: field.characterLimit,
            fieldWidth: field.fieldWidth,
            minValue: field.minValue,
            maxValue: field.maxValue,
            pattern: field.pattern,
            actionClicked: actionClicked,
            styleName: field.styleName,
            handleFieldBlur: handleFieldBlur
              ? (e, isValue) =>
                handleFieldBlur(sectionIndex, newFieldName, isValue ? e : e.target.value)
              : null,
            upperClass: upperClass,
            isSubTitle: field.isSubTitle,
            defaultValue: field.defaultValue,
            allFileds: field
          }}
        />
      );
    case "numberPlusMinus":
      return (
        <InputNumberPlusMinus
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputNumber component
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            fieldWidth: field.fieldWidth,
            actionClicked: actionClicked,
          }}
        />
      );

    case "select":
      return (
        <React.Fragment>
          {field.GA ? (
            <InputMultiSelect
              key={newFieldName}
              field={{
                name: newFieldName,
                label: field.label,
                value: formData[sectionIndex]?.[newFieldName] || "",
                onChange: (e) =>
                  handleFieldChange(sectionIndex, newFieldName, e.target.value),
                required: field.required,
                errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
                options: field.options,
                fieldWidth: field.fieldWidth,
                multiple: field.multiple,
                placeholder: field.placeholder,
                GAData: GAData,
                setGAData: setGAData,
                showModalGA: showModalGA,
                setShowModalGA: setShowModalGA,
                actionClicked: actionClicked,
                upperClass: upperClass,
                styleName: field.styleName

              }}

            />
          ) : field.multiple ? (
            <InputSelectMultiwithCheckbox
              key={newFieldName}
              field={{
                name: newFieldName,
                customname: field.name,
                label: field.label,
                value: formData[sectionIndex]?.[newFieldName] || "",
                onChange: (e) => {
                  field.multiple
                    ? handleFieldChange(sectionIndex, newFieldName, e)
                    : handleFieldChange(
                      sectionIndex,
                      newFieldName,
                      e.target.value
                    );
                },

                required: field.required,
                errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
                options: field.options,
                masterOptions: masterOptions,

                fieldWidth: field.fieldWidth,
                multiple: field.multiple,
                placeholder: field.placeholder,
                actionClicked: actionClicked,
                specialClass: field.specialClass,
                from: from,
                isCustomOptions: field.isCustomOptions,
                customOptions: field.customOptions,
                exludeOptions: exludeOptions,
                labelWidth: field.labelWidth,
                hintText: field.hintText,
                formData: formData,
                disabledMarks: field.disabledMarks || [],
                hasSelectAll: hasSelectAll,
                styleName: field.styleName,
                readOnly: field.readOnly,
                defaultValue: field.defaultValue,
                upperClass: upperClass,
                allProps: field
              }}
            />
          ) : field.isSearchable ? (
            <InputSelectwithSearch
              key={newFieldName}
              field={{
                name: newFieldName,
                customname: field.name,
                label: field.label,
                value: formData[sectionIndex]?.[newFieldName] || "",

                onChange: (e) => {
                  handleFieldChange(sectionIndex, newFieldName, e.value);
                },
                required: field.required,
                errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
                options: field.options,
                masterOptions: masterOptions,

                fieldWidth: field.fieldWidth,
                multiple: field.multiple,
                placeholder: field.placeholder,
                actionClicked: actionClicked,
                specialClass: field.specialClass,
                from: from,
                viewOnly: viewOnly,
                isCustomOptions: field.isCustomOptions,
                customOptions: field.customOptions,
                exludeOptions: exludeOptions,
                isSearchable: field.isSearchable,
                upperClass: upperClass || field.upperClass,
              }}
            />
          ) : (
            <InputSelect
              key={newFieldName}
              field={{
                name: newFieldName,
                customname: field.name,
                label: field.label,
                value: field.isUseForCustomInput
                  ? formData["newFieldName"]
                  : formData[sectionIndex]?.[newFieldName] || "",

                onChange: (e, isValue, optionDetails) => {
                  field.multiple
                    ? handleFieldChange(sectionIndex, newFieldName, isValue ? e : e)
                    : handleFieldChange(
                      sectionIndex,
                      newFieldName,
                      isValue ? e : e.target.value, '', '', 1, optionDetails
                    );
                },
                handleFieldBlur: handleFieldBlur
                  ? (e, isValue, optionDetails) => {
                    field.multiple
                      ? handleFieldBlur(sectionIndex, newFieldName, isValue ? e : e)
                      : handleFieldBlur(
                        sectionIndex,
                        newFieldName,
                        isValue ? e : e.target.value, '', '', 1, optionDetails
                      );
                  }
                  : null,
                required: field.required,
                errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
                options: field.options,
                masterOptions: masterOptions,
                fieldWidth: field.fieldWidth,
                multiple: field.multiple,
                placeholder: field.placeholder,
                actionClicked: actionClicked,
                specialClass: field.specialClass,
                from: from,
                viewOnly: viewOnly,
                isCustomOptions: field.isCustomOptions,
                customOptions: field.customOptions,
                exludeOptions: exludeOptions,
                isSearchable: field.isSearchable,
                upperClass: upperClass || field.upperClass,
                readOnly: field.readOnly,
                defaultValue: field.defaultValue,
                noCheckFirstOption: field.noCheckFirstOption
              }}
            />
          )}
        </React.Fragment>
      );
    case "DropDownWithLoadMore":
      return (
        <React.Fragment>
          <DropDownWithLoadMore
            key={newFieldName}
            upperClass={upperClass}
            field={{
              name: newFieldName,
              customname: field.name,
              label: field.label,
              value: formData[sectionIndex]?.[newFieldName] || "",
              onChange: (e, isValue, optionDetails) => {
                field.multiple
                  ? handleFieldChange(sectionIndex, newFieldName, e, '', '', 1, optionDetails)
                  : handleFieldChange(
                    sectionIndex,
                    newFieldName,
                    isValue ? e : e.target.value, '', '', 1, optionDetails
                  );
              },
              required: field.required,
              fieldWidth: field.fieldWidth,
              multiple: field.multiple,
              placeholder: field.placeholder,
              actionClicked: actionClicked,
              specialClass: field.specialClass,
              from: from,
              isSearchable: field.isSearchable,
              readOnly: field.readOnly,
              apiendpoint: field.apiendpoint,
              model_name: field.model_name,
              apimethod: field.apimethod,
              optionData: field.optionData,
              labelWidth: field.labelWidth,
              isCustomPayload: field.isCustomPayload,
              customPayload: field.customPayload,
              queryString: field.queryString,
              formData: formData,
              setFormData: setFormData,
              moduleType: moduleType,
              isEditMode: isEditMode,
              upperClass: field.upperClass,
              allProps: field
            }}
          />
        </React.Fragment>
      );
    case "radio":
      return (
        <InputRadio
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName],

            onChange: (e, isValue) =>
              handleFieldChange(sectionIndex, newFieldName, isValue ? e : e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
            tooltip: field.tooltip,
            fieldWidth: field.fieldWidth,
            options: field.options,
            actionClicked: actionClicked,
            viewOnly: viewOnly || field.isDisabledField,
            isNoLabel: field.isNoLabel,
            defaultValue: field.defaultValue
          }}
        />
      );
    case "phone":
      return (
        <InputPhone
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            required: field.required,
            errorMessage: showError ? validation.message : "",
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            fieldWidth: field.fieldWidth,
            minValue: field.minValue,
            maxValue: field.maxValue,
            pattern: field.pattern,
            actionClicked: actionClicked,
            styleName: field.styleName,
            handleFieldBlur: handleFieldBlur
              ? (e) =>
                handleFieldBlur(sectionIndex, newFieldName, e.target.value)
              : null,
            upperClass: upperClass,
            onChange: (value) => {
              handleFieldChange(sectionIndex, newFieldName, value);
            },
          }}
        />
      );
    case "checkbox":

      return (
        <span>

          <InputCheckbox
            key={newFieldName}
            field={{
              name: newFieldName,
              label: field.label,
              styleName: field.styleName,
              value: formData[sectionIndex]?.[newFieldName] || "",
              onChange: (e, options) =>
                handleFieldChange(
                  sectionIndex,
                  newFieldName,

                  [
                    "jrf_terms_and_conditions",
                    "jrf_vc_term_condition",
                  ].includes(newFieldName)
                    ? e?.target?.checked
                    : options,
                  [
                    "jrf_terms_and_conditions",
                    "jrf_vc_term_condition",
                  ].includes(newFieldName)
                    ? e?.target?.type
                    : null,

                  e?.target?.checked
                ),
              required: field.required,
              errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
              tooltip: field.tooltip,
              options: field.options,
              viewOnly: viewOnly || field.viewOnly,
              isSubCheckbox: isSubCheckbox,
              actionClicked: actionClicked,
              isOptionLabelNotShow: field.isOptionLabelNotShow,
              fieldWidth: field.fieldWidth,
              specialType: specialType,
              sequence: sequence,
              allProps: field,
              formData: formData
            }}
          />
        </span>
      );

    case "password":
      return (
        <InputPassword
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            actionClicked: actionClicked,
          }}
        />
      );
    case "email":
      return (
        <InputEmail
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            actionClicked: actionClicked,
            fieldWidth: field.fieldWidth,
          }}
        />
      );

    case "InputMultiEmail":
      return (
        <InputMultiEmail
          key={newFieldName}
          {...{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (emails) => {
              handleFieldChange(sectionIndex, newFieldName, emails);
            },
            required: field.required,
            error: showError ? validation.message : "", // Pass error message to InputSelect component
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            isNoEmailSuggest: field.isNoEmailSuggest,
            actionClicked: actionClicked,
          }}
        />

      );


    case "tel":
      return (
        <InputMobile
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            pattern: field.pattern,
            actionClicked: actionClicked,
          }}
        />
      );
    case "date":
      return (
        <InputDate
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
            readOnly: field.readOnly || field.isDisabled,
            tooltip: field.tooltip,
            minDate: field.minDate,
            maxDate: field.maxDate,
            defaultValue: formData[sectionIndex]?.[newFieldName] || "",
            fieldWidth: field.fieldWidth,
            pastDate: field.pastDate,
            pastdays: field.pastdays,
            futureDays: field.futureDays,
            renderTable: renderTable,
            actionClicked: actionClicked,
            upperClass: upperClass || field.upperClass,
            startDate: field.startDate,
            noLimitation: field.noLimitation,
            showTimeSelect: field.showTimeSelect,
            minTime: field.minTime,
            maxTime: field.maxTime,
            noDefaultValue: field.noDefaultValue,
            noRestrictionApply: field.noRestrictionApply,
            from: from,
          }}
        />
      );
    case "Time":
      return (
        <InputTimePicker
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            minDate: field.minDate,
            maxDate: field.maxDate,
            defaultValue: formData[sectionIndex]?.[newFieldName] || "",
            fieldWidth: field.fieldWidth,
            pastDate: field.pastDate,
            pastdays: field.pastdays,
            futureDays: field.futureDays,
            renderTable: renderTable,
            actionClicked: actionClicked,
            upperClass: upperClass,
            startDate: field.startDate,
            minTime: field.minTime
          }}
        />
      )
    // return (
    //   <InputTime
    //     key={newFieldName}
    //     field={{
    //       name: newFieldName,
    //       label: field.label,
    //       value: formData[sectionIndex]?.[newFieldName] || "",
    //       onChange: (e) =>
    //         handleFieldChange(sectionIndex, newFieldName, e.target.value),
    //       required: field.required,
    //       errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
    //       readOnly: field.readOnly,
    //       tooltip: field.tooltip,
    //       minDate: field.minDate,
    //       maxDate: field.maxDate,
    //       defaultValue: formData[sectionIndex]?.[newFieldName] || "",
    //       fieldWidth: field.fieldWidth,
    //       pastDate: field.pastDate,
    //       pastdays: field.pastdays,
    //       futureDays: field.futureDays,
    //       renderTable: renderTable,
    //       actionClicked: actionClicked,
    //       upperClass: upperClass,
    //       startDate: field.startDate,
    //       minTime: field.minTime
    //     }}
    //   />
    // );
    case "datetime":
      return (
        <DateTimePicker
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex]?.[newFieldName] || "",
            onChange: (e) => {
              handleFieldChange(sectionIndex, newFieldName, e)
            },
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputSelect component
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            minDate: field.minDate,
            maxDate: field.maxDate,
            placeholder: field.placeholder,
            actionClicked: actionClicked,
            fieldWidth: field.fieldWidth
          }}
        />
      );

    case "hr":
      return <HorizontalLine />;

    case "preview":
      return <Preview
        pdfUrl={pdfUrl}
        setPdfUrl={setPdfUrl}
        sharingPdfUrl={sharingPdfUrl}
        IsPreviewUpload={IsPreviewUpload}
        setSharingPdfUrl={setSharingPdfUrl}
        formData={formData}
        label={field.label}
        isCustom={field.isCustom}
        apiUrl={field.apiUrl}
        apiMethod={field.apiMethod}
        apiPayload={field.apiPayload}
      />;

    case "customInput":
      return (
        <CustomInput
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex],
            onChange: handleFieldChange,
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputNumber component
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            fieldWidth: field.fieldWidth,
            minValue: field.minValue,
            maxValue: field.maxValue,
            pattern: field.pattern,
            sectionIndex: sectionIndex,
            actionClicked: actionClicked,
            formData: formData
          }}
        />
      );

    case "customInput2":
      return (
        <CustomInput2
          key={newFieldName}
          field={{
            name: newFieldName,
            label: field.label,
            value: formData[sectionIndex],
            onChange: handleFieldChange,
            required: field.required,
            errorMessage: showError ? validation.message : "", // Pass error message to InputNumber component
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: field.tooltip,
            characterLimit: field.characterLimit,
            fieldWidth: field.fieldWidth,
            minValue: field.minValue,
            maxValue: field.maxValue,
            pattern: field.pattern,
            sectionIndex: sectionIndex,
            actionClicked: actionClicked,
            formData: formData
          }}
        />
      );
    case "icon":
      return (
        <InputIcon
          key={newFieldName}
          field={{
            fontSize: field.fontSize,
            headerLength: field.headerLength,
            textDecoration: field.textDecoration,
            color: field.color,
            name: newFieldName,
            label: field.label,
            value: !isStaticValue
              ? newFieldValue
                ? newFieldValue
                : formData[sectionIndex]?.[newFieldName] ||
                  formData[sectionIndex]?.[newFieldName] === 0
                  ? formData[sectionIndex]?.[newFieldName]
                  : field.value
              : field.value,
            onChange: (e) =>
              handleFieldChange(sectionIndex, newFieldName, e.target.value),
            required: field.required,
            errorMessage: showError ? validation.message : "",
            handleFieldChange: handleFieldChange,
            placeholder: field.placeholder,
            readOnly: field.readOnly,
            tooltip: tooltipTrue
              ? !isStaticValue
                ? newFieldValue
                  ? newFieldValue
                  : formData[sectionIndex]?.[newFieldName] || field.value
                : field.value
              : field.tooltip,
            characterLimit: field.characterLimit,
            validation: validation,
            icon: field.icon,
            fieldWidth: field.fieldWidth,
            styleName: field.styleName,
            actionClicked: actionClicked,
            centerAlign: centerAlign,
            upperClass: upperClass || field.upperClass,
            formData: formData,
            popupJSON: field.popupJSON,
            fieldIndex: fieldIndex,
            isForOnlyLabel: field.isForOnlyLabel
          }}
        />
      );
    default:
      return null;
  }
};

RenderFields.propTypes = {
  field: PropTypes.object,
  sectionIndex: PropTypes.number,
  fieldIndex: PropTypes.number,
  formData: PropTypes.object,
  handleFieldChange: PropTypes.func,
  formErrors: PropTypes.object,
  GAData: PropTypes.arrayOf(PropTypes.object),
  setGAData: PropTypes.func,
  showModalGA: PropTypes.bool,
  setShowModalGA: PropTypes.func,
  masterOptions: PropTypes.arrayOf(PropTypes.object),
  viewOnly: PropTypes.bool,
  customName: PropTypes.string,
  renderTable: PropTypes.func,
  actionClicked: PropTypes.func,
  from: PropTypes.string,
  centerAlign: PropTypes.bool,
  isStaticValue: PropTypes.bool,
  exludeOptions: PropTypes.arrayOf(PropTypes.string),
  handleFieldBlur: PropTypes.func,
  isViewLabel: PropTypes.bool,
  upperClass: PropTypes.string,
};

export default RenderFields;

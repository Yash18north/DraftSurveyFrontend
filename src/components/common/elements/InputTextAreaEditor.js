import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Undo,
  Context,
  Heading,
  List,
  Plugin,
  ButtonView,
  ContextWatchdog,
  Code,
  Strikethrough,
  Subscript,
  Superscript,
  WordCount,
  Underline

} from 'ckeditor5';
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import 'ckeditor5/ckeditor5.css';

const InputTextEditor = ({ field }) => {
  const {
    name,
    label,
    value,
    onChange,
    required,
    labelWidth,
    fieldWidth,
    characterLimit,
    pattern,
    defaultValue,
    viewOnly
  } = field;
  const [errorMsg, setErrorMsg] = useState(false);
  // useEffect(() => {
  //   const regex = new RegExp(pattern);
  //   if (value !== "") {
  //     if (regex.test(value)) {
  //       setErrorMsg(false);
  //     } else {
  //       setErrorMsg(true);
  //     }
  //   } else {
  //     setErrorMsg(false);
  //   }
  // }, [value]);

  // useEffect(() => {
  //   if ((value === undefined || value === "") && required) {
  //     setErrorMsg(true);
  //   } else {
  //     setErrorMsg(false);
  //   }
  // }, [value]);
  const editorRef = useRef();

  const [content, setContent] = useState(value);
  const handleEditorChange = (event, editor) => {
    const data = editorRef.current?.getData();
    // editorRef.current?.getData() // Get the HTML content
    const textLength = editorRef.current?.getData()?.length; // Get plain text length

    if (textLength <= characterLimit) {
      // setContent(data); // Update state if within max length
      onChange(editorRef.current?.getData());
      // setErrorMsg(false);
    } else {
      // alert(`Maximum length of ${characterLimit} characters exceeded.`);
      editorRef.current.setData(value);
      // setErrorMsg(true);
    }
  };
  useEffect(() => {
    if (defaultValue) {
      setTimeout(() => {
        onChange(defaultValue)
      }, 10)
    }
  }, [defaultValue]);
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.isReadOnly = viewOnly;
      // Optional: Hide toolbar when read-only
      const toolbarEl = editorRef.current.ui.view.toolbar.element;
      if (toolbarEl) toolbarEl.style.display = viewOnly ? "none" : "flex";
    }
  }, [viewOnly]);
  return (
    <div className="form-group my-2" style={{ position: "relative" }}>
      {label && (
        <label htmlFor={name} style={{ width: labelWidth || `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
        <CKEditorContext
          context={Context}
          contextWatchdog={ContextWatchdog}
        >
          <CKEditor
            editor={ClassicEditor}
            config={{
              plugins: [
                Essentials,
                Paragraph,
                Heading,
                List,
                Bold,
                Italic,
                Undo,
                Code,
                Strikethrough,
                Subscript,
                Superscript,
                WordCount,
                Underline
              ],
              wordCount: {
                onUpdate: stats => {
                },
              },

              toolbar: {
                items: [
                  'undo', 'redo',
                  '|',
                  'heading',
                  '|',
                  'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                  '|',
                  'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                  '|',
                  'link', 'uploadImage', 'blockQuote', 'codeBlock',
                  '|',
                  'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                ],
                shouldNotGroupWhenFull: false
              },
              isReadOnly: viewOnly 
            }}

            contextItemMetadata={{
              name: 'editor1',
              yourAdditionalData: 2
            }}

            onReady={(editor) => {
              editorRef.current = editor;
              if(viewOnly){
                editor.enableReadOnlyMode("readonly-mode");
              }
              
            }}
            data={value}
            onChange={handleEditorChange}
          // data={value}
          // onChange={() => {
          // onChange(editorRef.current?.getData());
          // }}
          />
        </CKEditorContext>
        {errorMsg && (
          <p className="text-danger errorMsg">`Maximum length of ${characterLimit} characters exceeded.`</p>
        )}
      </div>
    </div>

  );
}

InputTextEditor.propTypes = {
  field: PropTypes.object.isRequired,
};
export default InputTextEditor;
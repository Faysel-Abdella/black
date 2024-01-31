"use client";
import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type EditorProps = {
  onChange?: (data: string) => void;
  buttonType: string;
  clickedDataContent: any;
};

const Editor = ({ onChange, buttonType, clickedDataContent }: EditorProps) => {
  const [editorData, setEditorData] = useState("");

  useEffect(() => {
    setEditorData(buttonType === "modification" ? clickedDataContent : "");
  }, [buttonType, clickedDataContent]);

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);

    if (onChange) {
      onChange(data);
    }
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      onChange={handleEditorChange}
    />
  );
};

export default Editor;

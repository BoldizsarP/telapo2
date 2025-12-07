// This is my Editorjs component, better if make a seperate component and use it

import { useEffect, useRef } from "react";
import EditorJS, { ToolConstructable, ToolSettings } from "@editorjs/editorjs";

import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Image from "@editorjs/image";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
const EDITOR_TOOLS: {
  [toolName: string]: ToolConstructable | ToolSettings;
} = {
  code: Code,
  header: {
    class: Header as unknown as ToolConstructable,
    shortcut: "CMD+H",
    inlineToolbar: true,
    config: {
      placeholder: "Enter a Header",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  paragraph: {
    class: Paragraph as unknown as ToolConstructable,
    // shortcut: 'CMD+P',
    inlineToolbar: true,
  },
  table: Table,
  list: List,
  quote: Quote,
  delimiter: Delimiter,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: (file: File) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve({
                success: 1,
                file: {
                  url: reader.result as string,
                },
              });
            };

            reader.onerror = () => {
              reject(new Error("Failed to read file"));
            };

            reader.readAsDataURL(file);
          });
        },
        async uploadByUrl(url: string) {
          return {
            success: 1,
            file: {
              url: url,
            },
          };
        },
      },
    },
  },
};
function Editor({
  data,
  onChange,
  holder,
  style = {
    paddingLeft: "1rem",
    width: "100%",
    minHeight: 500,
    borderRadius: " 7px",
    background: "fff",
  },
  readonly = false,
}: {
  data: any;
  onChange: (content: any) => void;
  holder: string;
  style?: React.CSSProperties;
  readonly?: boolean;
}) {
  //add a reference to editor

  const ref = useRef<EditorJS | null>(null);
  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        placeholder: "Start writting here..",
        tools: EDITOR_TOOLS,
        data,
        async onChange(api, event) {
          const content = await api.saver.save();
          // console.log(content, "sdfb");
          onChange(content);
        },
        readOnly: readonly,
      });
      ref.current = editor;
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div id={holder} style={style} />
    </>
  );
}

export default Editor;

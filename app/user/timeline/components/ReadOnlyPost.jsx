"use client";

import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { initialConfig } from "../create-post/components/common";

function LoadSavedStatePlugin({ data }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!data) return;

    try {
      const json =
        typeof data === "string"
          ? JSON.parse(data)
          : data;

      const editorState = editor.parseEditorState(json);
      editor.setEditorState(editorState);
    } catch (err) {
      console.error(err);
    }
  }, [editor, data]);

  return null;
}

export default function ReadOnlyPost({content }) {
  const basicConfig = {
    namespace: "post-view",
    editable: false,
    onError(error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <LexicalComposer initialConfig={{...basicConfig,...initialConfig}}>
        <LoadSavedStatePlugin data={content} />

        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="outline-none whitespace-pre-wrap break-words"
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <LinkPlugin />
        <ListPlugin />
      </LexicalComposer>
    </div>
  );
}
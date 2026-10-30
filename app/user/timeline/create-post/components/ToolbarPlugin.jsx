"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  $getSelection,
  $isRangeSelection,
} from "lexical";

import {
  $setBlocksType,
} from "@lexical/selection";

import {
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text";

import { $createParagraphNode } from "lexical";

import { TOGGLE_LINK_COMMAND } from "@lexical/link";

import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

import {
  FaUndo,
  FaRedo,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaCode,
  FaLink,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
} from "react-icons/fa";

import { MdTitle } from "react-icons/md";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const prevent = (e) => e.preventDefault();

  const iconBtn =
    "p-2 rounded hover:bg-gray-200 transition";

  const insertLink = () => {
    const url = window.prompt("Enter URL");
    if (!url) return;

    editor.dispatchCommand(
      TOGGLE_LINK_COMMAND,
      url.trim()
    );
  };

  const setHeading = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          $createHeadingNode(tag)
        );
      }
    });
  };

  const setParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          $createParagraphNode()
        );
      }
    });
  };

  const setQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          $createQuoteNode()
        );
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-1 px-1 border-b bg-white">

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}>
        <FaUndo />
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}>
        <FaRedo />
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() => setHeading("h1")}>
        <span className="font-bold">H1</span>
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() => setHeading("h2")}>
        <span className="font-bold">H2</span>
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() => setHeading("h3")}>
        <span className="font-bold">H3</span>
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={setParagraph}>
        <MdTitle />
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() =>
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "bold"
          )
        }>
        <FaBold />
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() =>
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "italic"
          )
        }>
        <FaItalic />
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() =>
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "underline"
          )
        }>
        <FaUnderline />
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() =>
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "strikethrough"
          )
        }>
        <FaStrikethrough />
      </button>

      <button className={iconBtn}
        onMouseDown={prevent}
        onClick={() =>
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "code"
          )
        }>
        <FaCode />
      </button>

      <button
        className={iconBtn}
        onMouseDown={prevent}
        onClick={insertLink}>
        <FaLink />
      </button>

      <button
        className={iconBtn}
        onMouseDown={prevent}
        onClick={() =>
          editor.dispatchCommand(
            INSERT_UNORDERED_LIST_COMMAND
          )
        }>
        <FaListUl />
      </button>

      <button
        className={iconBtn}
        onMouseDown={prevent}
        onClick={() =>
          editor.dispatchCommand(
            INSERT_ORDERED_LIST_COMMAND
          )
        }>
        <FaListOl />
      </button>

      <button
        className={iconBtn}
        onMouseDown={prevent}
        onClick={setQuote}>
        <FaQuoteLeft />
      </button>

    </div>
  );
}
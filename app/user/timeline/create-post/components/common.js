import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import {
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";

export const backgroundColor = [
  {
    id: 1,
    value: "bg-gradient-to-br from-[#ff00cc] to-[#3333ff]",
  },
  {
    id: 2,
    value: "bg-gradient-to-br from-[#ff512f] to-[#dd2476]",
  },
  {
    id: 3,
    value: "bg-gradient-to-br from-[#141E30] to-[#243B55]",
  },
  {
    id: 4,
    value: "bg-gradient-to-br from-[#7F00FF] to-[#E100FF]",
  },
  {
    id: 5,
    value: "bg-gradient-to-br from-[#f7971e] to-[#ffd200]",
  },
  {
    id: 6,
    value: "bg-gradient-to-br from-[#000000] to-[#434343]",
  },
  {
    id: 7,
    value: "bg-gradient-to-br from-[#00c6ff] to-[#0072ff]",
  },
  {
    id: 8,
    value: "bg-gradient-to-br from-[#f953c6] to-[#b91d73]",
  },
  {
    id: 9,
    value: "bg-gradient-to-br from-[#43cea2] to-[#185a9d]",
  },
  {
    id: 10,
    value: "bg-gradient-to-br from-[#ff9966] to-[#ff5e62]",
  },
  {
    id: 11,
    value: "bg-gradient-to-br from-[#56ab2f] to-[#a8e063]",
  },
  {
    id: 12,
    value: "bg-gradient-to-br from-[#614385] to-[#516395]",
  },
  {
    id: 13,
    value: "bg-gradient-to-br from-[#e65c00] to-[#f9d423]",
  },
  {
    id: 14,
    value: "bg-gradient-to-br from-[#02aab0] to-[#00cdac]",
  },
  {
    id: 15,
    value: "bg-gradient-to-br from-[#fc466b] to-[#3f5efb]",
  },
  {
    id: 16,
    value: "bg-gradient-to-br from-[#00f260] to-[#0575e6]",
  },
  {
    id: 17,
    value: "bg-gradient-to-br from-[#ff0844] to-[#ffb199]",
  },
  {
    id: 18,
    value: "bg-gradient-to-br from-[#654ea3] to-[#eaafc8]",
  },
  {
    id: 19,
    value: "bg-gradient-to-br from-[#2193b0] to-[#6dd5ed]",
  },
  {
    id: 20,
    value: "bg-gradient-to-br from-[#cc2b5e] to-[#753a88]",
  },
  {
    id: 21,
    value: "bg-gradient-to-br from-[#42275a] to-[#734b6d]",
  },
  {
    id: 22,
    value: "bg-gradient-to-br from-[#bdc3c7] to-[#2c3e50]",
  },
  {
    id: 23,
    value: "bg-gradient-to-br from-[#de6262] to-[#ffb88c]",
  },
  {
    id: 24,
    value: "bg-gradient-to-br from-[#06beb6] to-[#48b1bf]",
  },
  {
    id: 25,
    value: "bg-gradient-to-br from-[#eb3349] to-[#f45c43]",
  },
  {
    id: 26,
    value: "bg-gradient-to-br from-[#dd5e89] to-[#f7bb97]",
  },
  {
    id: 27,
    value: "bg-gradient-to-br from-[#56ccf2] to-[#2f80ed]",
  },
  {
    id: 28,
    value: "bg-gradient-to-br from-[#c94b4b] to-[#4b134f]",
  },
  {
    id: 29,
    value: "bg-gradient-to-br from-[#373b44] to-[#4286f4]",
  },
  {
    id: 30,
    value: "bg-gradient-to-br from-[#ff6a00] to-[#ee0979]",
  },
  {
    id: 31,
    value: "bg-gradient-to-br from-[#11998e] to-[#38ef7d]",
  },
  {
    id: 32,
    value: "bg-gradient-to-br from-[#fc4a1a] to-[#f7b733]",
  },
  {
    id: 33,
    value: "bg-gradient-to-br from-[#7f00ff] to-[#e100ff]",
  },
  {
    id: 34,
    value: "bg-gradient-to-br from-[#00b09b] to-[#96c93d]",
  },
  {
    id: 35,
    value: "bg-gradient-to-br from-[#ff758c] to-[#ff7eb3]",
  },
  {
    id: 36,
    value: "bg-gradient-to-br from-[#1f4037] to-[#99f2c8]",
  },
  {
    id: 37,
    value: "bg-gradient-to-br from-[#fc5c7d] to-[#6a82fb]",
  },
  {
    id: 38,
    value: "bg-gradient-to-br from-[#ff416c] to-[#ff4b2b]",
  },
  {
    id: 39,
    value:
      "bg-gradient-to-br from-[#3a1c71] via-[#d76d77] to-[#ffaf7b]",
  },
  {
    id: 40,
    value: "bg-gradient-to-br from-[#8360c3] to-[#2ebf91]",
  },
  {
    id: 41,
    value: "bg-gradient-to-br from-[#ff0099] to-[#493240]",
  },
  {
    id: 42,
    value: "bg-gradient-to-br from-[#4e54c8] to-[#8f94fb]",
  },
  {
    id: 43,
    value: "bg-gradient-to-br from-[#ff512f] to-[#f09819]",
  },
  {
    id: 44,
    value: "bg-gradient-to-br from-[#24c6dc] to-[#514a9d]",
  },
  {
    id: 45,
    value: "bg-gradient-to-br from-[#e96443] to-[#904e95]",
  },
  {
    id: 46,
    value: "bg-gradient-to-br from-[#232526] to-[#414345]",
  },
  {
    id: 47,
    value: "bg-gradient-to-br from-[#4568dc] to-[#b06ab3]",
  },
  {
    id: 48,
    value: "bg-gradient-to-br from-[#43c6ac] to-[#191654]",
  },
  {
    id: 49,
    value: "bg-gradient-to-br from-[#ff4e50] to-[#f9d423]",
  },
  {
    id: 50,
    value: "bg-gradient-to-br from-[#30cfd0] to-[#330867]",
  },
];

  export const initialConfig = {
    namespace: "facebook-style-editor",
    theme: {
      link: "text-blue-500 underline",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
        code: "bg-gray-200 px-1 rounded font-mono",
      },
      list: {
        ul: "list-disc ml-6",
        ol: "list-decimal ml-6",
        listitem: "",
      },
      heading: {
        h1: "text-4xl",
        h2: "text-3xl",
        h3: "text-2xl",
      },
      quote: "border-l-4 pl-4 italic text-gray-500",
    },

    nodes: [
      LinkNode,
      AutoLinkNode,
      ListNode,
      ListItemNode,
      HeadingNode,   // <-- ADD
      QuoteNode,     // <-- ADD
    ],

    onError(error) {
      console.error(error);
    },
  };
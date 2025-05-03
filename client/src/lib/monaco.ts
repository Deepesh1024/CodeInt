import { editor } from "monaco-editor";

export function initMonacoTheme() {
  // Define custom theme based on the design
  editor.defineTheme("code-portfolio-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a737d" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "function", foreground: "50fa7b" },
      { token: "variable", foreground: "f8f8f2" },
    ],
    colors: {
      "editor.background": "#1e293b", // slate-dark
      "editor.foreground": "#e2e8f0", // text-light
      "editorCursor.foreground": "#e2e8f0",
      "editor.lineHighlightBackground": "#132f4c", // dark-blue-light
      "editorLineNumber.foreground": "#94a3b8", // text-dark
      "editor.selectionBackground": "#214d7688",
      "editor.inactiveSelectionBackground": "#313c4c",
      "editorIndentGuide.background": "#334155", // slate-light
      "editorIndentGuide.activeBackground": "#4b5563",
      "editorWidget.background": "#1e293b", // slate-dark
      "editorWidget.border": "#334155", // slate-light
      "editorSuggestWidget.background": "#0f172a", // slate-darker
      "editorSuggestWidget.border": "#334155", // slate-light
      "editorSuggestWidget.foreground": "#e2e8f0", // text-light
      "editorSuggestWidget.highlightForeground": "#2cbc63", // primary
      "editorSuggestWidget.selectedBackground": "#132f4c", // dark-blue-light
    },
  });

  return "code-portfolio-dark";
}

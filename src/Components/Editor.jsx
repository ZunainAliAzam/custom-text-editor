import React, { useState, useEffect, useRef } from "react";
import { Button, Select } from "antd";
import CreateModal from "./CreateModal";
import "./Editor.css";

const { Option } = Select;

const TextEditor = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const editorRef = useRef(null);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      if (selection && editorRef.current.contains(selection.anchorNode)) {
        setSelection(selection);
      }
    });
  }, []);

  const applyStyle = (style) => {
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    Object.assign(span.style, style);
    range.surroundContents(span);
    setHtmlContent(editorRef.current.innerHTML);
  };

  const handleBold = () => applyStyle({ fontWeight: "bold" });
  const handleItalic = () => applyStyle({ fontStyle: "italic" });
  const handleUnderline = () => applyStyle({ textDecoration: "underline" });
  const handleFontSizeChange = (size) => applyStyle({ fontSize: `${size}px` });

  const handleTableGenerated = (rows, columns) => {
    const tableElement = document.createElement("table");
    tableElement.border = "1";
    tableElement.style.borderCollapse = "collapse";

    for (let i = 0; i < rows; i++) {
      const row = tableElement.insertRow();
      for (let j = 0; j < columns; j++) {
        const cell = row.insertCell();
        cell.textContent = " ";
        cell.style.padding = "8px";
        cell.style.border = "1px solid black";
      }
    }

    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(tableElement);
    } else {
      editorRef.current.appendChild(tableElement);
    }

    setHtmlContent(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    setHtmlContent(editorRef.current.innerHTML);
  };

  const formatHtml = (htmlString) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString.trim();
    return tempElement.outerHTML;
  };

  // Add row management functionalities from TableGenerator

  const handleKeyDown = (e) => {
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedCell = range.startContainer.parentNode;

    if (selectedCell.tagName !== "TD") return;

    const rowIndex = selectedCell.parentNode.rowIndex;
    const colIndex = selectedCell.cellIndex;

    switch (e.key) {
      case "ArrowDown":
        moveToCell(rowIndex + 1, colIndex);
        break;
      case "ArrowUp":
        moveToCell(rowIndex - 1, colIndex);
        break;
      case "ArrowRight":
        moveToCell(rowIndex, colIndex + 1);
        break;
      case "ArrowLeft":
        moveToCell(rowIndex, colIndex - 1);
        break;
      case "Enter":
        e.preventDefault();
        addRow(selectedCell.parentNode);
        break;
      case "Backspace":
        if (!selectedCell.textContent.trim() && selectedCell.parentNode.rowIndex > 0) {
          e.preventDefault();
          deleteRow(selectedCell.parentNode);
        }
        break;
      default:
        break;
    }
  };

  const moveToCell = (rowIndex, colIndex) => {
    const table = editorRef.current.querySelector("table");
    if (!table) return;
    const rows = table.rows;
    if (rowIndex < 0 || rowIndex >= rows.length) return;
    const cells = rows[rowIndex].cells;
    if (colIndex < 0 || colIndex >= cells.length) return;
    cells[colIndex].focus();
  };

  const addRow = (currentRow) => {
    const table = currentRow.parentNode;
    const newRow = table.insertRow(currentRow.rowIndex + 1);
    for (let i = 0; i < currentRow.cells.length; i++) {
      const newCell = newRow.insertCell();
      newCell.textContent = " ";
      newCell.style.padding = "8px";
      newCell.style.border = "1px solid black";
      newCell.contentEditable = true;
    }
  };

  const deleteRow = (currentRow) => {
    const table = currentRow.parentNode;
    table.deleteRow(currentRow.rowIndex);
  };

  return (
    <div className="text-editor-container">
      <div className="toolbar">
        <Button type="primary" shape="circle" onClick={handleBold}>
          <span style={{ fontWeight: "600" }}>B</span>
        </Button>
        <Button type="primary" shape="circle" onClick={handleItalic}>
          <span style={{ fontWeight: "600" }}>I</span>
        </Button>
        <Button type="primary" shape="circle" onClick={handleUnderline}>
          <span style={{ fontWeight: "600" }}>U</span>
        </Button>
        <Select
          onChange={handleFontSizeChange}
          defaultValue="Font Size"
          style={{ width: 120, marginRight: "0.75rem" }}
        >
          <Option value="8">8</Option>
          <Option value="10">10</Option>
          <Option value="12">12</Option>
          <Option value="14">14</Option>
          <Option value="16">16</Option>
          <Option value="18">18</Option>
          <Option value="20">20</Option>
        </Select>
        <CreateModal onGenerate={handleTableGenerated} />
      </div>
      <div
        className="editable-area"
        contentEditable
        ref={editorRef}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          border: "1px solid black",
          minHeight: "200px",
          padding: "10px",
        }}
      ></div>
      <h3>Generated HTML:</h3>
      <pre
        style={{
          border: "1px solid black",
          minHeight: "200px",
          padding: "10px",
        }}
      >
        {formatHtml(htmlContent)}
      </pre>
    </div>
  );
};

export default TextEditor;

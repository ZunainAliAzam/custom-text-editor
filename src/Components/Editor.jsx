import React, { useState, useEffect, useRef } from "react";
import { Button, Select } from "antd";
import CreateModal from "./CreateModal";
import "./Editor.css";

const { Option } = Select;

const TextEditor = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const editorRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [contextCell, setContextCell] = useState(null);

  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      if (selection && editorRef.current.contains(selection.anchorNode)) {
        setSelection(selection);
      }
    });

    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0 });
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const applyStyle = (style) => {
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    Object.assign(span.style, style);
    range.surroundContents(span);
    setHtmlContent(editorRef.current.innerHTML);
  };

  const removeStyle = (styleProperty) => {
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const selectedNode = range.commonAncestorContainer;

    if (selectedNode.nodeType === Node.TEXT_NODE) {
      const parentElement = selectedNode.parentElement;
      parentElement.style[styleProperty] = "";
      if (!parentElement.getAttribute('style')) {
        parentElement.removeAttribute('style');
      }
    }

    setHtmlContent(editorRef.current.innerHTML);
  };

  const isStyleApplied = (styleProperty, value) => {
    if (!selection || !selection.rangeCount) return false;
    const range = selection.getRangeAt(0);
    const selectedNode = range.commonAncestorContainer;

    if (selectedNode.nodeType === Node.TEXT_NODE) {
      const parentElement = selectedNode.parentElement;
      return parentElement.style[styleProperty] === value;
    }

    return false;
  };

  const handleFontSizeChange = (size) => {size}
  const handleBold = () => {
    if (isStyleApplied("fontWeight", "bold")) {
      removeStyle({fontWeight:"bold"});
    } else {
      applyStyle({ fontWeight: "bold" });
    }
  };

  const handleItalic = () => {
    if (isStyleApplied("fontStyle", "italic")) {
      removeStyle({fontStyle:"italic"});
    } else {
      applyStyle({ fontStyle: "italic" });
    }
  };

  const handleUnderline = () => {
    if (isStyleApplied("textDecoration", "underline")) {
      removeStyle({textDecoration:"underline"});
    } else {
      applyStyle({ textDecoration: "underline" });
    }
  };

  const handleTableGenerated = (rows, columns) => {
    const tableElement = document.createElement("table");
    tableElement.border = "1";
    tableElement.style.borderCollapse = "collapse";

    for (let i = 0; i < rows; i++) {
      const row = tableElement.insertRow();
      for (let j = 0; j < columns; j++) {
        const cell = row.insertCell();
        cell.textContent = " ";
        cell.style.width = "100px";
        cell.style.height = "50px";
        cell.style.padding = "8px";
        cell.style.border = "1px solid black";
        cell.contentEditable = true;
        cell.addEventListener("contextmenu", (e) => handleContextMenu(e, cell));
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
      default:
        break;
    }
  };

  const moveToCell = (rowIndex, colIndex) => {
    const table = editorRef.current.querySelector("table");
    if (table) {
      const row = table.rows[rowIndex];
      if (row) {
        const cell = row.cells[colIndex];
        if (cell) {
          cell.focus();
          setSelection(window.getSelection());
        }
      }
    }
  };

  const handleContextMenu = (e, cell) => {
    e.preventDefault();
    setContextCell(cell);
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  const deleteRow = () => {
    if (!contextCell) return;
    const row = contextCell.parentNode;
    row.parentNode.removeChild(row);
    setContextMenu({ visible: false, x: 0, y: 0 });
    setHtmlContent(editorRef.current.innerHTML);
  };

  const deleteColumn = () => {
    if (!contextCell) return;
    const table = contextCell.closest("table");
    const colIndex = contextCell.cellIndex;
    for (const row of table.rows) {
      row.deleteCell(colIndex);
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
    setHtmlContent(editorRef.current.innerHTML);
  };

  const addRow = () => {
    if (!contextCell) return;
    const table = contextCell.closest("table");
    const rowIndex = contextCell.parentNode.rowIndex;
    const newRow = table.insertRow(rowIndex + 1);
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      const newCell = newRow.insertCell();
      newCell.textContent = " ";
      newCell.style.width = "100px";
      newCell.style.height = "50px";
      newCell.style.padding = "8px";
      newCell.style.border = "1px solid black";
      newCell.contentEditable = true;
      newCell.addEventListener("contextmenu", (e) => handleContextMenu(e, newCell));
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
    setHtmlContent(editorRef.current.innerHTML);
  };

  const addColumn = () => {
    if (!contextCell) return;
    const table = contextCell.closest("table");
    const colIndex = contextCell.cellIndex;
    for (const row of table.rows) {
      const newCell = row.insertCell(colIndex + 1);
      newCell.textContent = " ";
      newCell.style.width = "100px";
      newCell.style.height = "50px";
      newCell.style.padding = "8px";
      newCell.style.border = "1px solid black";
      newCell.contentEditable = true;
      newCell.addEventListener("contextmenu", (e) => handleContextMenu(e, newCell));
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
    setHtmlContent(editorRef.current.innerHTML);
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

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={addRow}>Add Row</button>
          <button onClick={addColumn}>Add Column</button>
          <button onClick={deleteRow}>Delete Row</button>
          <button onClick={deleteColumn}>Delete Column</button>
        </div>
      )}
    </div>
  );
};

export default TextEditor;

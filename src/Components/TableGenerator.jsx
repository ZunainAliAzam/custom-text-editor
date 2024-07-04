import React, { useState, useEffect, useRef } from "react";
import "./TableGenerator.css"

const TableGenerator = ({
  rows,
  columns,
  handleBold,
  handleItalic,
  handleUnderline,
  handleFontSizeChange,
}) => {
  const [tableData, setTableData] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const inputRefs = useRef([]);

  useEffect(() => {
    const initialData = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({ content: "", styles: {} }))
    );
    setTableData(initialData);
    setSelectedCell({ row: 0, col: 0 });
  }, [rows, columns]);

  useEffect(() => {
    const currentRef = inputRefs.current[selectedCell.row]?.[selectedCell.col];
    if (currentRef) {
      currentRef.focus();
    }
  }, [selectedCell]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][colIndex] = {
      ...updatedTableData[rowIndex][colIndex],
      content: value,
    };
    setTableData(updatedTableData);
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    switch (e.key) {
      case "ArrowDown":
        setSelectedCell((prev) => ({
          row: Math.min(prev.row + 1, tableData.length - 1),
          col: prev.col,
        }));
        break;
      case "ArrowUp":
        setSelectedCell((prev) => ({
          row: Math.max(prev.row - 1, 0),
          col: prev.col,
        }));
        break;
      case "ArrowRight":
        setSelectedCell((prev) => ({
          row: prev.row,
          col: Math.min(prev.col + 1, tableData[0].length - 1),
        }));
        break;
      case "ArrowLeft":
        setSelectedCell((prev) => ({
          row: prev.row,
          col: Math.max(prev.col - 1, 0),
        }));
        break;
      case "Enter":
        e.preventDefault();
        addRow(rowIndex);
        break;
      case "Backspace":
        if (!tableData[rowIndex][colIndex].content && tableData.length > 1) {
          e.preventDefault();
          deleteRow(rowIndex);
        }
        break;
      default:
        break;
    }
  };

  const addRow = (rowIndex) => {
    const updatedTableData = [
      ...tableData.slice(0, rowIndex + 1),
      Array.from({ length: columns }, () => ({ content: "", styles: {} })),
      ...tableData.slice(rowIndex + 1),
    ];
    setTableData(updatedTableData);
  };

  const deleteRow = (rowIndex) => {
    const updatedTableData = tableData.filter((_, i) => i !== rowIndex);
    setTableData(updatedTableData);
  };

  const applyStyle = (style) => {
    const updatedTableData = [...tableData];
    const cell = updatedTableData[selectedCell.row][selectedCell.col];
    cell.styles = { ...cell.styles, ...style };
    setTableData(updatedTableData);
  };

  useEffect(() => {
    if (handleBold) handleBold(() => applyStyle({ fontWeight: "bold" }));
    if (handleItalic) handleItalic(() => applyStyle({ fontStyle: "italic" }));
    if (handleUnderline)
      handleUnderline(() => applyStyle({ textDecoration: "underline" }));
    if (handleFontSizeChange)
      handleFontSizeChange((size) => applyStyle({ fontSize: `${size}px` }));
  }, [handleBold, handleItalic, handleUnderline, handleFontSizeChange]);

  const generateTableHTML = () => {
    let tableHTML = '<table border="1" style="border-collapse: collapse;">\n';
    tableData.forEach((row) => {
      tableHTML += "  <tr>\n";
      row.forEach((cell) => {
        const { content, styles } = cell;
        const styleString = Object.entries(styles)
          .map(([key, value]) => `${key}: ${value};`)
          .join(" ");
        tableHTML += `    <td style="${styleString}">${content}</td>\n`;
      });
      tableHTML += "  </tr>\n";
    });
    tableHTML += "</table>";
    return tableHTML;
  };

  const tableHTML = generateTableHTML();

  return (
    <div className="table-generator-container">
      <div className="table-display" contenteditable="true">
        <table border="1" style={{ borderCollapse: "collapse" }}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="text"
                      value={cell.content}
                      style={cell.styles}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      ref={(el) =>
                        (inputRefs.current[rowIndex] = {
                          ...inputRefs.current[rowIndex],
                          [colIndex]: el,
                        })
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <textarea className="html-display" value={tableHTML} readOnly />
    </div>
  );
};

export default TableGenerator;

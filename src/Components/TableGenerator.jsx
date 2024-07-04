import React, { useState, useEffect, useRef } from "react";
import "./TableGenerator.css";

const TableGenerator = ({ rows, columns }) => {
  const [tableData, setTableData] = useState(
    Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => "")
    )
  );
  const [selectedRow, setSelectedRow] = useState(null);
  const tableRef = useRef();

  useEffect(() => {
    setTableData(
      Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => "")
      )
    );
  }, [rows, columns]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][colIndex] = value;
    setTableData(updatedTableData);
  };

  const handleKeyDown = (e) => {
    if (selectedRow !== null) {
      if (e.key === "Enter") {
        e.preventDefault();
        addRow(selectedRow);
      } else if (e.key === "Backspace" && tableData.length > 1) {
        e.preventDefault();
        deleteRow(selectedRow);
      }
    }
  };

  const addRow = (rowIndex) => {
    const updatedTableData = [
      ...tableData.slice(0, rowIndex + 1),
      Array.from({ length: columns }, () => ""),
      ...tableData.slice(rowIndex + 1)
    ];
    setTableData(updatedTableData);
  };

  const deleteRow = (rowIndex) => {
    const updatedTableData = tableData.filter((_, i) => i !== rowIndex);
    setTableData(updatedTableData);
  };

  const handleRowClick = (rowIndex) => {
    setSelectedRow(rowIndex);
  };

  const generateTableHTML = () => {
    let tableHTML = `<table border="1" style="border-collapse: collapse;">\n`;
    tableData.forEach((row) => {
      tableHTML += `  <tr>\n`;
      row.forEach((cell) => {
        tableHTML += `    <td>${cell}</td>\n`;
      });
      tableHTML += `  </tr>\n`;
    });
    tableHTML += `</table>`;
    return tableHTML;
  };

  const tableHTML = generateTableHTML();

  return (
    <div className="table-generator-container">
      <div
        className="table-display"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={tableRef}
      >
        <table border="1" style={{ borderCollapse: "collapse" }}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => handleRowClick(rowIndex)}
                className={selectedRow === rowIndex ? "selected" : ""}
              >
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <textarea
        className="html-display"
        value={tableHTML}
        readOnly
      />
    </div>
  );
};

export default TableGenerator;

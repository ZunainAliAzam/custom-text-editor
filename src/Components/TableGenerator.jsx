import React, { useState, useEffect } from "react";
import "./TableGenerator.css";

const TableGenerator = ({ rows, columns }) => {
  const [tableData, setTableData] = useState(
    Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => "")
    )
  );

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
      <div className="table-display">
        <table border="1" style={{ borderCollapse: "collapse" }}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
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
      <textarea className="html-display" value={tableHTML} readOnly />
    </div>
  );
};

export default TableGenerator;

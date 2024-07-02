import { useState } from "react";
import "./App.css";
import CreateModal from "./Components/CreateModal";
import TableGenerator from "./Components/TableGenerator";

function App() {
  const [tableConfig, setTableConfig] = useState({ rows: 0, columns: 0 });

  const handleGenerate = (rows, columns) => {
    setTableConfig({ rows, columns });
  };

  return (
    <>
      <CreateModal onGenerate={handleGenerate} />
      {tableConfig.rows > 0 && tableConfig.columns > 0 && (
        <TableGenerator rows={tableConfig.rows} columns={tableConfig.columns} />
      )}
    </>
  );
}

export default App;

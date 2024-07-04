import { useState, useRef } from "react";
import "./App.css";
import CreateModal from "./Components/CreateModal";
import TableGenerator from "./Components/TableGenerator";
import MenuBar from "./Components/MenuBar";

function App() {
  const [tableConfig, setTableConfig] = useState({ rows: 0, columns: 0 });
  const boldRef = useRef(null);
  const italicRef = useRef(null);
  const underlineRef = useRef(null);
  const fontSizeRef = useRef(null);

  const handleGenerate = (rows, columns) => {
    setTableConfig({ rows, columns });
  };

  return (
    <>
      <MenuBar
        onBold={boldRef.current}
        onItalic={italicRef.current}
        onUnderline={underlineRef.current}
        onFontSizeChange={fontSizeRef.current}
      />
      <CreateModal onGenerate={handleGenerate} />
      {tableConfig.rows > 0 && tableConfig.columns > 0 && (
        <TableGenerator
          rows={tableConfig.rows}
          columns={tableConfig.columns}
          handleBold={(fn) => (boldRef.current = fn)}
          handleItalic={(fn) => (italicRef.current = fn)}
          handleUnderline={(fn) => (underlineRef.current = fn)}
          handleFontSizeChange={(fn) => (fontSizeRef.current = fn)}
        />
      )}
    </>
  );
}

export default App;

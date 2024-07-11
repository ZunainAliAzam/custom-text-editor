import React from "react";
import "./App.css";
import TextEditor from "./Components/Editor";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <>
      <h1 className=" text-center">Text Editor</h1>
      <TextEditor />
    </>
  );
};

export default App;

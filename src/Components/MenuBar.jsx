import React from "react";
import "./MenuBar.css";

const MenuBar = ({ onBold, onItalic, onUnderline, onFontSizeChange }) => {
  return (
    <div className="menu-bar">
      <button onClick={onBold}>
        <b>B</b>
      </button>
      <button onClick={onItalic}>
        <i>I</i>
      </button>
      <button onClick={onUnderline}>
        <u>U</u>
      </button>
      <select onChange={(e) => onFontSizeChange(e.target.value)}>
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
      </select>
    </div>
  );
};

export default MenuBar;

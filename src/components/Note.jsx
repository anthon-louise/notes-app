import React from 'react';
import "./../index.css"

const Note = ({ content, important, toggleImportance }) => {
  const label = important ? 'Make not important' : 'Make important';

  return (
    <li className="list">
      {content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Note;
import React from "react";

const CalendarTile = ({ date, mood, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border p-2 rounded text-center cursor-pointer hover:bg-gray-100"
    >
      <div className="font-bold">{date}</div>
      {mood && <div className="text-sm">🙂</div>}
    </div>
  );
};

export default CalendarTile;

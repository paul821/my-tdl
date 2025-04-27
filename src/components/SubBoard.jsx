import React from "react";
import { Checklist } from "./Checklist";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SubBoard = ({ subBoard, boardId, setBoards, accentColor }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: subBoard.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateSubBoard = (updates) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        subBoards: board.subBoards.map(sb => sb.id === subBoard.id ? { ...sb, ...updates } : sb)
      } : board
    ));
  };

  const deleteSubBoard = () => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        subBoards: board.subBoards.filter(sb => sb.id !== subBoard.id)
      } : board
    ));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100 dark:bg-[#1F2937] p-4 rounded-lg shadow-sm hover:shadow-lg border dark:border-gray-700 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={subBoard.title}
          onChange={e => updateSubBoard({ title: e.target.value })}
          className="flex-grow text-lg font-semibold p-2 border rounded bg-gray-50 dark:bg-[#374151] text-black dark:text-white"
          style={{ color: subBoard.color }}
        />
        <input
          type="color"
          value={subBoard.color}
          onChange={e => updateSubBoard({ color: e.target.value })}
          className="w-8 h-8 rounded-full border-2 border-transparent hover:border-indigo-400 transition cursor-pointer"
        />
        <button onClick={deleteSubBoard} className="text-red-400 hover:text-red-600 text-xl ml-2" title="Delete Sub-Board">
          🗑️
        </button>
      </div>

      <Checklist
        items={subBoard.items}
        boardId={boardId}
        subBoardId={subBoard.id}
        setBoards={setBoards}
        accentColor={accentColor}
      />
    </div>
  );
};

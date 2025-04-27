import React from "react";
import { SubBoard } from "./SubBoard";
import { Checklist } from "./Checklist";
import { ResearchTable } from "./ResearchTable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export const Board = ({ board, setBoards, accentColor }) => {
  const addSubBoard = () => {
    const newSubBoard = { id: Date.now(), title: 'New Sub-Board', color: accentColor, items: [] };
    setBoards(prev => prev.map(b =>
      b.id === board.id ? { ...b, subBoards: [...b.subBoards, newSubBoard] } : b
    ));
  };

  const deleteBoard = () => {
    setBoards(prev => prev.filter(b => b.id !== board.id));
  };

  const updateBoardTitle = (newTitle) => {
    setBoards(prev => prev.map(b =>
      b.id === board.id ? { ...b, title: newTitle } : b
    ));
  };

  return (
    <div className="bg-white dark:bg-[#1F2937] p-6 rounded-xl shadow-md hover:shadow-2xl border dark:border-gray-700 transition-all duration-300 relative">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={board.title}
          onChange={(e) => updateBoardTitle(e.target.value)}
          className="text-2xl font-bold text-gray-800 dark:text-gray-100 bg-transparent border-b focus:outline-none focus:border-indigo-400"
        />
        <button onClick={deleteBoard} className="text-red-400 hover:text-red-600 text-xl" title="Delete Board">
          🗑️
        </button>
      </div>

      {board.type === 'classes' || board.type === 'jobs' ? (
        <SortableContext
          items={board.subBoards?.map(sub => sub.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {board.subBoards.map(subBoard => (
              <SubBoard
                key={subBoard.id}
                subBoard={subBoard}
                boardId={board.id}
                setBoards={setBoards}
                accentColor={accentColor}
              />
            ))}
          </div>
          <button
            onClick={addSubBoard}
            style={{ backgroundColor: accentColor }}
            className="text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition mt-4"
          >
            + Add Sub-Board
          </button>
        </SortableContext>
      ) : board.type === 'research' ? (
        <ResearchTable
          items={board.items}
          boardId={board.id}
          setBoards={setBoards}
          accentColor={accentColor}
        />
      ) : board.type === 'gig' ? (
        <Checklist
          items={board.items}
          boardId={board.id}
          setBoards={setBoards}
          accentColor={accentColor}
        />
      ) : null}
    </div>
  );
};

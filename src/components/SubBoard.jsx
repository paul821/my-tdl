import React from 'react';
import { Checklist } from './Checklist';

export const SubBoard = ({ subBoard, boardId, setBoards }) => {
  const updateSubBoard = (updates) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        subBoards: board.subBoards.map(sb => sb.id === subBoard.id ? { ...sb, ...updates } : sb)
      } : board
    ));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={subBoard.title}
          onChange={e => updateSubBoard({ title: e.target.value })}
          className="flex-grow text-lg font-semibold p-1 border-b focus:outline-none focus:border-indigo-300 max-w-full"
          style={{ color: subBoard.color }}
        />
        <input
          type="color"
          value={subBoard.color}
          onChange={e => updateSubBoard({ color: e.target.value })}
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
      <Checklist items={subBoard.items} boardId={boardId} subBoardId={subBoard.id} setBoards={setBoards} />
    </div>
  );
};

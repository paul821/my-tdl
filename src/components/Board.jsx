import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SubBoard } from './SubBoard';
import { Checklist } from './Checklist';
import { ResearchTable } from './ResearchTable';

export const Board = ({ board, setBoards }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: board.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const addSubBoard = () => {
    const newSubBoard = { id: Date.now(), title: 'New Sub-Board', color: '#4a5568', items: [] };
    setBoards(prev => prev.map(b =>
      b.id === board.id ? { ...b, subBoards: [...b.subBoards, newSubBoard] } : b
    ));
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{board.title}</h2>

      {board.type === 'classes' || board.type === 'jobs' ? (
        <div className="space-y-4">
          {board.subBoards.map(subBoard => (
            <SubBoard key={subBoard.id} subBoard={subBoard} boardId={board.id} setBoards={setBoards} />
          ))}
          <button onClick={addSubBoard} className="text-indigo-600 hover:text-indigo-800 transition">+ Add Sub-Board</button>
        </div>
      ) : board.type === 'research' ? (
        <ResearchTable items={board.items} boardId={board.id} setBoards={setBoards} />
      ) : board.type === 'gig' ? (
        <Checklist items={board.items} boardId={board.id} setBoards={setBoards} />
      ) : null}
    </div>
  );
};

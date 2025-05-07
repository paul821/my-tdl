import React, { useState } from 'react';
import { ChecklistItem } from './ChecklistItem';

export const Checklist = ({ items, boardId, subBoardId, setBoards, accentColor }) => {
  const [newItemDescription, setNewItemDescription] = useState('');

  const addItem = () => {
    if (newItemDescription.trim()) {
      const newItem = { id: Date.now(), description: newItemDescription, priority: 'Medium', completed: false };
      setBoards(prev => prev.map(board =>
        board.id === boardId ? {
          ...board,
          subBoards: subBoardId
            ? board.subBoards.map(sb => sb.id === subBoardId ? { ...sb, items: [...sb.items, newItem] } : sb)
            : undefined,
          items: !subBoardId ? [...board.items, newItem] : board.items
        } : board
      ));
      setNewItemDescription('');
    }
  };

  return (
    <div className="space-y-2">
      {items.map(item => (
        <ChecklistItem key={item.id} item={item} boardId={boardId} subBoardId={subBoardId} setBoards={setBoards} />
      ))}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={newItemDescription}
          onChange={e => setNewItemDescription(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Add new task"
          className="flex-grow p-2 rounded border bg-gray-50 dark:bg-[#374151] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E2A84]"
        />
        <button
          onClick={addItem}
          style={{ backgroundColor: accentColor }}
          className="text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};

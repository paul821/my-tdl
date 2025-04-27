import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const ChecklistItem = ({ item, boardId, subBoardId, setBoards }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateItem = (updates) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        subBoards: subBoardId
          ? board.subBoards.map(sb =>
            sb.id === subBoardId ? {
              ...sb,
              items: sb.items.map(it => it.id === item.id ? { ...it, ...updates } : it)
            } : sb)
          : undefined,
        items: !subBoardId
          ? board.items.map(it => it.id === item.id ? { ...it, ...updates } : it)
          : board.items
      } : board
    ));
  };

  const deleteItem = () => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        subBoards: subBoardId
          ? board.subBoards.map(sb =>
            sb.id === subBoardId ? { ...sb, items: sb.items.filter(it => it.id !== item.id) } : sb)
          : undefined,
        items: !subBoardId
          ? board.items.filter(it => it.id !== item.id)
          : board.items
      } : board
    ));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition cursor-grab active:cursor-grabbing"
    >
      <input
        type="checkbox"
        checked={item.completed}
        onChange={() => updateItem({ completed: !item.completed })}
        className="h-4 w-4 text-indigo-600"
      />
      <input
        type="text"
        value={item.description}
        onChange={e => updateItem({ description: e.target.value })}
        className={`flex-grow p-1 border-b max-w-full ${
          item.completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
      />
      <select
        value={item.priority}
        onChange={e => updateItem({ priority: e.target.value })}
        className={`p-1 border-b focus:ring-2 ${
          item.priority === 'High' ? 'text-red-500' :
          item.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'
        }`}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={deleteItem} className="text-red-500 hover:text-red-700 px-2">✕</button>
    </div>
  );
};

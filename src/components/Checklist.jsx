import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChecklistItem } from './ChecklistItem';

export const Checklist = ({ items, boardId, subBoardId, setBoards }) => {
  const [newItemDescription, setNewItemDescription] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setBoards(prev => prev.map(board =>
        board.id === boardId ? {
          ...board,
          subBoards: subBoardId
            ? board.subBoards.map(sb => sb.id === subBoardId
              ? { ...sb, items: arrayMove(sb.items, sb.items.findIndex(i => i.id === active.id), sb.items.findIndex(i => i.id === over.id)) }
              : sb)
            : undefined,
          items: !subBoardId
            ? arrayMove(board.items, board.items.findIndex(i => i.id === active.id), board.items.findIndex(i => i.id === over.id))
            : board.items
        } : board
      ));
    }
  };

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <ChecklistItem key={item.id} item={item} boardId={boardId} subBoardId={subBoardId} setBoards={setBoards} />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={newItemDescription}
          onChange={e => setNewItemDescription(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Add new task"
          className="flex-grow p-2 border rounded focus:ring-2 focus:ring-indigo-300"
        />
        <button onClick={addItem} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Add
        </button>
      </div>
    </div>
  );
};

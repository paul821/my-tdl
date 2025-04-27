import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { initialBoards } from '../utils/initialBoards';
import { Board } from './Board';
import { Modal } from './Modal';

export const App = () => {
  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem('boards');
    return savedBoards ? JSON.parse(savedBoards) : initialBoards;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardType, setNewBoardType] = useState('classes');

  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = boards.findIndex(board => board.id === active.id);
      const newIndex = boards.findIndex(board => board.id === over.id);
      setBoards(arrayMove(boards, oldIndex, newIndex));
    }
  };

  const createBoard = () => {
    if (newBoardTitle && newBoardType) {
      const newBoard = {
        id: Date.now(),
        type: newBoardType,
        title: newBoardTitle,
        subBoards: newBoardType === 'classes' || newBoardType === 'jobs' ? [] : undefined,
        items: newBoardType === 'research' || newBoardType === 'gig' ? [] : undefined
      };
      setBoards(prev => [...prev, newBoard]);
      setIsModalOpen(false);
      setNewBoardTitle('');
      setNewBoardType('classes');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">Paul's TDL</h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={boards.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all">
            {boards.map(board => (
              <Board key={board.id} board={board} setBoards={setBoards} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition w-full md:w-auto"
      >
        Add New Board
      </button>

      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Create New Board</h2>

          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Board Title"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-300"
          />

          <select
            value={newBoardType}
            onChange={(e) => setNewBoardType(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-300"
          >
            <option value="classes">Classes</option>
            <option value="jobs">Jobs</option>
            <option value="research">Research</option>
            <option value="gig">Gig</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={createBoard}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

import React from 'react';
import { PlusIcon } from "@heroicons/react/24/outline";

export const ResearchTable = ({ items, boardId, setBoards, accentColor }) => {
  const addRow = () => {
    const newRow = { id: Date.now(), name: '', department: '', priority: 'Medium' };
    setBoards(prev => prev.map(board =>
      board.id === boardId ? { ...board, items: [...board.items, newRow] } : board
    ));
  };

  const updateRow = (rowId, updates) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        items: board.items.map(row => row.id === rowId ? { ...row, ...updates } : row)
      } : board
    ));
  };

  const deleteRow = (rowId) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        items: board.items.filter(row => row.id !== rowId)
      } : board
    ));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Priority</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(row => (
            <tr key={row.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="p-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={e => updateRow(row.id, { name: e.target.value })}
                  className="w-full p-1 border-b bg-transparent dark:bg-[#374151] dark:text-white focus:outline-none"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={row.department}
                  onChange={e => updateRow(row.id, { department: e.target.value })}
                  className="w-full p-1 border-b bg-transparent dark:bg-[#374151] dark:text-white focus:outline-none"
                />
              </td>
              <td className="p-2">
                <select
                  value={row.priority}
                  onChange={e => updateRow(row.id, { priority: e.target.value })}
                  className={`w-full p-1 border-b focus:outline-none rounded-md ${
                    row.priority === 'High'
                      ? 'bg-red-600 text-white'
                      : row.priority === 'Medium'
                      ? 'bg-orange-500 text-white'
                      : 'bg-yellow-400 text-black'
                  }`}
                >
                  <option value="High" className="bg-red-600 text-white">High</option>
                  <option value="Medium" className="bg-orange-500 text-white">Medium</option>
                  <option value="Low" className="bg-yellow-400 text-black">Low</option>
                </select>
              </td>
              <td className="p-2">
                <button onClick={() => deleteRow(row.id)} className="text-red-500 hover:text-red-700 px-2">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addRow}
        style={{ backgroundColor: accentColor }}
        className="mt-4 w-full text-white py-2 rounded hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        Add Row
      </button>
    </div>
  );
};

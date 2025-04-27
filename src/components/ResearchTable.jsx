import React from 'react';

export const ResearchTable = ({ items, boardId, setBoards }) => {
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
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Priority</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(row => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={e => updateRow(row.id, { name: e.target.value })}
                  className="w-full p-1 border-b focus:outline-none focus:border-indigo-300"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={row.department}
                  onChange={e => updateRow(row.id, { department: e.target.value })}
                  className="w-full p-1 border-b focus:outline-none focus:border-indigo-300"
                />
              </td>
              <td className="p-2">
                <select
                  value={row.priority}
                  onChange={e => updateRow(row.id, { priority: e.target.value })}
                  className={`w-full p-1 border-b focus:outline-none focus:border-indigo-300 ${
                    row.priority === 'High' ? 'text-red-500' :
                    row.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                  }`}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </td>
              <td className="p-2">
                <button onClick={() => deleteRow(row.id)} className="text-red-500 hover:text-red-700 px-2">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
        Add Row
      </button>
    </div>
  );
};

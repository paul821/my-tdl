import React from 'react';

export const ChecklistItem = ({ item, boardId, subBoardId, setBoards }) => {
  const updateItem = (updates) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? {
        ...board,
        subBoards: subBoardId 
          ? board.subBoards.map(sb => 
              sb.id === subBoardId ? {
                ...sb,
                items: sb.items.map(it => 
                  it.id === item.id ? { ...it, ...updates } : it
                )
              } : sb
            )
          : undefined,
        items: !subBoardId 
          ? board.items.map(it => 
              it.id === item.id ? { ...it, ...updates } : it
            )
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
              sb.id === subBoardId ? {
                ...sb,
                items: sb.items.filter(it => it.id !== item.id)
              } : sb
            )
          : undefined,
        items: !subBoardId 
          ? board.items.filter(it => it.id !== item.id)
          : board.items
      } : board
    ));
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
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
        className={`flex-grow p-1 border-b max-w-full bg-transparent focus:outline-none focus:border-indigo-300 ${
          item.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'
        }`}
      />
      <select
        value={item.priority}
        onChange={e => updateItem({ priority: e.target.value })}
        className={`p-1 border-b focus:outline-none focus:border-indigo-300 rounded-md ${
          item.priority === 'High'
            ? 'bg-red-600 text-white'
            : item.priority === 'Medium'
            ? 'bg-orange-500 text-white'
            : 'bg-yellow-400 text-black'
        }`}
      >
        <option value="High" className="bg-red-600 text-white">High</option>
        <option value="Medium" className="bg-orange-500 text-white">Medium</option>
        <option value="Low" className="bg-yellow-400 text-black">Low</option>
      </select>
      <button onClick={deleteItem} className="text-red-500 hover:text-red-700 px-2">✕</button>
    </div>
  );
};

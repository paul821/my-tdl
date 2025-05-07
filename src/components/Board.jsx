import React, { useState } from "react";
import { SubBoard } from "./SubBoard";
import { Checklist } from "./Checklist";
import { ResearchTable } from "./ResearchTable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/24/outline";

export const Board = ({ board, setBoards, onBoardUpdate, accentColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(board.title);
  const [titleColor, setTitleColor] = useState(board.titleColor || accentColor);
  const [isAddingSubBoard, setIsAddingSubBoard] = useState(false);
  const [newSubBoardTitle, setNewSubBoardTitle] = useState("");
  const [newSubBoardColor, setNewSubBoardColor] = useState(accentColor);

  // Handle title update
  const handleTitleUpdate = () => {
    if (editedTitle.trim()) {
      const updatedBoard = {
        ...board,
        title: editedTitle.trim(),
        titleColor: titleColor
      };
      onBoardUpdate(updatedBoard);
      setIsEditing(false);
    }
  };

  // Handle board deletion
  const handleDeleteBoard = () => {
    setBoards(prevBoards => prevBoards.filter(b => b.id !== board.id));
  };

  // Handle sub-board updates
  const handleSubBoardUpdate = (updatedSubBoard) => {
    const updatedBoard = {
      ...board,
      subBoards: board.subBoards.map(subBoard =>
        subBoard.id === updatedSubBoard.id ? updatedSubBoard : subBoard
      )
    };
    onBoardUpdate(updatedBoard);
  };

  // Handle item updates
  const handleItemUpdate = (updatedItem) => {
    if (board.type === "research" || board.type === "gig") {
      const updatedBoard = {
        ...board,
        items: board.items.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        )
      };
      onBoardUpdate(updatedBoard);
    }
  };

  // Handle adding new sub-board
  const handleAddSubBoard = () => {
    if (newSubBoardTitle.trim()) {
      const newSubBoard = {
        id: Date.now(),
        title: newSubBoardTitle.trim(),
        color: newSubBoardColor,
        items: []
      };
      const updatedBoard = {
        ...board,
        subBoards: [...board.subBoards, newSubBoard]
      };
      onBoardUpdate(updatedBoard);
      setIsAddingSubBoard(false);
      setNewSubBoardTitle("");
      setNewSubBoardColor(accentColor);
    }
  };

  // Handle deleting sub-board
  const handleDeleteSubBoard = (subBoardId) => {
    const updatedBoard = {
      ...board,
      subBoards: board.subBoards.filter(subBoard => subBoard.id !== subBoardId)
    };
    onBoardUpdate(updatedBoard);
  };

  // Handle adding new item
  const handleAddItem = (subBoardId, itemText) => {
    if (itemText.trim()) {
      const newItem = {
        id: Date.now(),
        text: itemText.trim(),
        completed: false
      };

      if (board.type === "classes" || board.type === "jobs") {
        const updatedBoard = {
          ...board,
          subBoards: board.subBoards.map(subBoard =>
            subBoard.id === subBoardId
              ? { ...subBoard, items: [...subBoard.items, newItem] }
              : subBoard
          )
        };
        onBoardUpdate(updatedBoard);
      } else {
        const updatedBoard = {
          ...board,
          items: [...board.items, newItem]
        };
        onBoardUpdate(updatedBoard);
      }
    }
  };

  // Handle deleting item
  const handleDeleteItem = (itemId, subBoardId = null) => {
    if (board.type === "classes" || board.type === "jobs") {
      const updatedBoard = {
        ...board,
        subBoards: board.subBoards.map(subBoard =>
          subBoard.id === subBoardId
            ? { ...subBoard, items: subBoard.items.filter(item => item.id !== itemId) }
            : subBoard
        )
      };
      onBoardUpdate(updatedBoard);
    } else {
      const updatedBoard = {
        ...board,
        items: board.items.filter(item => item.id !== itemId)
      };
      onBoardUpdate(updatedBoard);
    }
  };

  // Handle toggling item completion
  const handleToggleItem = (itemId, subBoardId = null) => {
    if (board.type === "classes" || board.type === "jobs") {
      const updatedBoard = {
        ...board,
        subBoards: board.subBoards.map(subBoard =>
          subBoard.id === subBoardId
            ? {
                ...subBoard,
                items: subBoard.items.map(item =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item
                )
              }
            : subBoard
        )
      };
      onBoardUpdate(updatedBoard);
    } else {
      const updatedBoard = {
        ...board,
        items: board.items.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      };
      onBoardUpdate(updatedBoard);
    }
  };

  // Handle updating item text
  const handleUpdateItemText = (itemId, newText, subBoardId = null) => {
    if (newText.trim()) {
      if (board.type === "classes" || board.type === "jobs") {
        const updatedBoard = {
          ...board,
          subBoards: board.subBoards.map(subBoard =>
            subBoard.id === subBoardId
              ? {
                  ...subBoard,
                  items: subBoard.items.map(item =>
                    item.id === itemId ? { ...item, text: newText.trim() } : item
                  )
                }
              : subBoard
          )
        };
        onBoardUpdate(updatedBoard);
      } else {
        const updatedBoard = {
          ...board,
          items: board.items.map(item =>
            item.id === itemId ? { ...item, text: newText.trim() } : item
          )
        };
        onBoardUpdate(updatedBoard);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#1F2937] p-6 rounded-xl shadow-md hover-card gradient-bg border dark:border-gray-700 transition-all duration-300 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleUpdate}
            onKeyPress={(e) => e.key === 'Enter' && handleTitleUpdate()}
            style={{ color: titleColor }}
            className="text-2xl font-heading font-semibold bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-current focus:outline-none transition-all duration-200 flex-1"
          />
          <input
            type="color"
            value={titleColor}
            onChange={(e) => {
              setTitleColor(e.target.value);
              const updatedBoard = {
                ...board,
                title: editedTitle.trim(),
                titleColor: e.target.value
              };
              onBoardUpdate(updatedBoard);
            }}
            className="w-6 h-6 rounded cursor-pointer"
          />
        </div>
        <button 
          onClick={handleDeleteBoard} 
          className="text-red-400 hover:text-red-600 text-xl transition-colors duration-200 ml-2" 
          title="Delete Board"
        >
          🗑️
        </button>
      </div>

      {board.type === 'classes' || board.type === 'jobs' ? (
        <>
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
                  onUpdate={handleSubBoardUpdate}
                  onDelete={handleDeleteSubBoard}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </SortableContext>

          {isAddingSubBoard ? (
            <div className="mt-4 p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newSubBoardTitle}
                  onChange={(e) => setNewSubBoardTitle(e.target.value)}
                  placeholder="Enter sub-board title"
                  className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  autoFocus
                />
                <input
                  type="color"
                  value={newSubBoardColor}
                  onChange={(e) => setNewSubBoardColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                />
                <button
                  onClick={handleAddSubBoard}
                  className="btn-hover-effect flex items-center gap-2 px-4 py-2 rounded-full transition text-white hover:opacity-90"
                  style={{ 
                    backgroundColor: accentColor,
                    '--accent-color': accentColor 
                  }}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddingSubBoard(false);
                    setNewSubBoardTitle("");
                    setNewSubBoardColor(accentColor);
                  }}
                  className="btn-hover-effect text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-full transition-colors"
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingSubBoard(true)}
              className="btn-hover-effect mt-4 flex items-center gap-2 px-4 py-2 rounded-full transition text-white hover:opacity-90 w-full justify-center gradient-primary"
              style={{ '--accent-color': accentColor }}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Board</span>
            </button>
          )}
        </>
      ) : board.type === 'research' ? (
        <ResearchTable
          items={board.items}
          boardId={board.id}
          setBoards={setBoards}
          onUpdate={handleItemUpdate}
          accentColor={accentColor}
        />
      ) : board.type === 'gig' ? (
        <Checklist
          items={board.items}
          boardId={board.id}
          setBoards={setBoards}
          onUpdate={handleItemUpdate}
          accentColor={accentColor}
        />
      ) : null}
    </div>
  );
};

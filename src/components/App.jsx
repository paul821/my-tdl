import React, { useState, useEffect } from "react";
import { Board } from "./Board";
import { Modal } from "./Modal";
import { initialBoards } from "../utils/initialBoards";
import { useDarkMode } from "../hooks/useDarkMode";

export const App = () => {
  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem("boards");
    return savedBoards ? JSON.parse(savedBoards) : initialBoards;
  });

  const { isDark, toggleDarkMode } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardType, setNewBoardType] = useState("classes");
  const [accentColor, setAccentColor] = useState("#6366f1");

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewBoardTitle("");
    setNewBoardType("classes");
  };

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      const newBoard = {
        id: Date.now(),
        type: newBoardType,
        title: newBoardTitle,
        subBoards: newBoardType === "classes" || newBoardType === "jobs" ? [] : undefined,
        items: newBoardType === "research" || newBoardType === "gig" ? [] : undefined,
      };
      setBoards(prev => [...prev, newBoard]);
      closeModal();
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-gray-100 dark:bg-[#111827] transition-colors duration-300">
      <header className="py-6 px-8 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <h1
          className="text-4xl font-bold transition"
          style={{ color: accentColor }}
        >
          Paul's TDL
        </h1>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">{isDark ? '🌙' : '☀️'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isDark} onChange={toggleDarkMode} />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-all relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-8 h-8 rounded-full border-2 border-transparent hover:border-indigo-400 transition cursor-pointer"
            title="Pick accent color"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {boards.map(board => (
          <Board
            key={board.id}
            board={board}
            setBoards={setBoards}
            accentColor={accentColor}
          />
        ))}
      </main>

      <footer className="flex justify-center py-8">
        <button
          onClick={openModal}
          style={{ backgroundColor: accentColor }}
          className="text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:opacity-90"
        >
          + Add New Board
        </button>
      </footer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Board</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Board Title"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-[#374151] dark:text-white"
          />
          <select
            value={newBoardType}
            onChange={(e) => setNewBoardType(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-[#374151] dark:text-white"
          >
            <option value="classes">Classes</option>
            <option value="jobs">Jobs</option>
            <option value="research">Research</option>
            <option value="gig">Gig</option>
          </select>
          <div className="flex gap-4 justify-center mt-6">
            <button onClick={handleAddBoard} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition">
              Save
            </button>
            <button onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white px-6 py-2 rounded-full transition">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

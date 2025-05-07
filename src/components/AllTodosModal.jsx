import React from "react";
import { Modal } from "./Modal";

export const AllTodosModal = ({ isOpen, onClose, boards }) => {
  const getAllTodos = () => {
    const todos = [];
    boards.forEach(board => {
      if (board.type === "classes" || board.type === "jobs") {
        // Handle sub-boards
        board.subBoards?.forEach(subBoard => {
          subBoard.items?.forEach(item => {
            todos.push({
              ...item,
              boardTitle: board.title,
              subBoardTitle: subBoard.title,
              boardType: board.type
            });
          });
        });
      } else if (board.type === "research") {
        // Handle research table items
        board.items?.forEach(item => {
          todos.push({
            ...item,
            boardTitle: board.title,
            boardType: board.type
          });
        });
      } else if (board.type === "gig") {
        // Handle gig items
        board.items?.forEach(item => {
          todos.push({
            ...item,
            boardTitle: board.title,
            boardType: board.type
          });
        });
      }
    });
    return todos.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const todos = getAllTodos();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">All Todos</h2>
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No todos found</p>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white dark:bg-[#1F2937] p-4 rounded-lg shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{todo.description || todo.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {todo.boardTitle} {todo.subBoardTitle ? `> ${todo.subBoardTitle}` : ""}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      todo.priority === 'High'
                        ? "bg-red-600 text-white"
                        : todo.priority === 'Medium'
                        ? "bg-orange-500 text-white"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {todo.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}; 
import React from 'react';
import { PlusIcon } from "@heroicons/react/24/outline";

export const Footer = ({ accentColor, onAddBoard }) => {
  return (
    <footer className="flex justify-center py-8">
      <button
        onClick={onAddBoard}
        style={{ backgroundColor: accentColor }}
        className="text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:opacity-90 flex items-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        Add New Board
      </button>
    </footer>
  );
}; 
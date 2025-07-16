import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export const Header = ({
  accentColor,
  setAccentColor,
  isDark,
  toggleDarkMode,
  onViewAllTodos,
  user,
  onLogin,
  onSignup,
  onLogout,
  onUndo, // new
  onRedo, // new
  canUndo, // new
  canRedo // new
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Set default accent color if not set
  React.useEffect(() => {
    if (!accentColor) {
      setAccentColor('#4E2A84');
    }
  }, [accentColor, setAccentColor]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    console.log('Color changed to:', newColor); // Debug log
    setAccentColor(newColor);
  };

  const MenuButton = () => (
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
    >
      {isMenuOpen ? (
        <XMarkIcon className="w-6 h-6" />
      ) : (
        <Bars3Icon className="w-6 h-6" />
      )}
    </button>
  );

  const NavItems = ({ className = "" }) => (
    <div className={`flex flex-col md:flex-row md:items-center gap-4 ${className}`}>
      <div className="flex flex-row gap-2 items-center">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`px-3 py-2 rounded-full font-medium transition border ${canUndo ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-200 text-blue-300 cursor-not-allowed'} `}
          title="Undo"
        >
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`px-3 py-2 rounded-full font-medium transition border ${canRedo ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-200 text-orange-300 cursor-not-allowed'} `}
          title="Redo"
        >
          Redo
        </button>
        <button
          onClick={onViewAllTodos}
          style={{ backgroundColor: accentColor }}
          className="hover:opacity-90 text-white px-4 py-2 rounded-full transition w-full md:w-auto text-center ml-2"
        >
          View All Todos
        </button>
      </div>
      <div className="flex items-center gap-2 justify-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleDarkMode}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4E2A84] dark:peer-focus:ring-[#4E2A84] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4E2A84]"></div>
        </label>
        <input
          type="color"
          value={accentColor}
          onChange={handleColorChange}
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
      {user ? (
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition w-full md:w-auto text-center"
        >
          Logout
        </button>
      ) : (
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={onLogin}
            className="text-white px-4 py-2 rounded-full transition w-full md:w-auto text-center font-medium"
            style={{ backgroundColor: '#DA291C' }}
          >
            Login
          </button>
          <button
            onClick={onSignup}
            className="text-black px-4 py-2 rounded-full transition w-full md:w-auto text-center font-medium"
            style={{ backgroundColor: '#FBE122' }}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white dark:bg-[#1F2937] shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold" style={{ color: accentColor }}>
            Paul's TDL
          </h1>
          <MenuButton />
          <div className="hidden md:block">
            <NavItems />
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-4 pb-2 border-t pt-4 md:hidden">
            <NavItems />
          </div>
        )}
      </div>
    </header>
  );
}; 
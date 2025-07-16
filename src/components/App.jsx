import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Modal } from "./Modal";
import { Board } from "./Board";
import { AllTodosModal } from "./AllTodosModal";
import { LoginModal } from "./LoginModal";
import { SignupModal } from "./SignupModal";
import { useDarkMode } from "../hooks/useDarkMode";
import { initialBoards } from "../utils/initialBoards";
import { auth, db } from "../firebase/config";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const App = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [accentColor, setAccentColor] = useState("#4E2A84");
  const [boards, setBoards] = useState(initialBoards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllTodosModalOpen, setIsAllTodosModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardType, setNewBoardType] = useState("classes");
  const [user, setUser] = useState(null);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Add simple debug function
  const debugData = (data, label) => {
    console.log(`=== ${label} ===`);
    if (Array.isArray(data)) {
      console.log('Array length:', data.length);
      data.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          id: item.id,
          type: item.type,
          title: item.title,
          subBoards: item.subBoards?.length || 0,
          items: item.items?.length || 0
        });
      });
    } else {
      console.log('Data:', data);
    }
    console.log('===================');
  };

  useEffect(() => {
    // Check if Firebase is initialized
    if (!auth || !db) {
      console.warn('Firebase not initialized - running in local mode');
      return;
    }

    setIsFirebaseInitialized(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('=== AUTH STATE CHANGE ===');
      console.log('User:', user ? 'Logged in' : 'Logged out');
      setUser(user);
      
      if (user) {
        try {
          // Fetch user's boards from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          console.log('Document exists:', userDoc.exists());
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            debugData(userData, 'FIRESTORE DATA');
            
            // Validate and clean the boards data
            let boardsToSet = initialBoards;
            
            if (userData.boards && Array.isArray(userData.boards) && userData.boards.length > 0) {
              console.log('=== PROCESSING BOARDS ===');
              boardsToSet = userData.boards.map(board => {
                const processedBoard = {
                  id: board.id || Date.now(),
                  type: board.type || 'classes',
                  title: board.title || 'Untitled Board',
                  titleColor: board.titleColor || accentColor,
                };

                if (board.type === 'classes' || board.type === 'jobs') {
                  processedBoard.subBoards = (board.subBoards || []).map(subBoard => ({
                    id: subBoard.id || Date.now(),
                    title: subBoard.title || 'Untitled Sub-Board',
                    color: subBoard.color || '#4a5568',
                    items: subBoard.items || []
                  }));
                } else {
                  processedBoard.items = board.items || [];
                }

                return processedBoard;
              });
              debugData(boardsToSet, 'PROCESSED BOARDS');
            } else {
              console.log('No valid boards found, using initial boards');
            }
            
            setBoards(boardsToSet);
          } else {
            console.log('No user document found, initializing with default boards');
            await setDoc(doc(db, "users", user.uid), { 
              boards: initialBoards,
              userId: user.email?.split('@')[0]
            });
            setBoards(initialBoards);
          }
        } catch (error) {
          console.error('Error fetching boards:', error);
          setBoards(initialBoards);
        }
      } else {
        console.log('=== RESETTING TO DEFAULT ===');
        // Reset to initial boards with default colors
        const resetBoards = initialBoards.map(board => ({
          ...board,
          subBoards: board.subBoards?.map(subBoard => ({
            ...subBoard,
            color: '#4a5568' // Default color
          }))
        }));
        setBoards(resetBoards);
      }
    });

    return () => unsubscribe();
  }, []);

  // Add debounced save function
  const debouncedSave = useCallback(
    async (boardsToSave) => {
      if (!user || !isFirebaseInitialized) return;

      try {
        console.log('=== SAVING BOARDS ===');
        debugData(boardsToSave, 'BOARDS TO SAVE');
        
        // Ensure boards data is valid before saving
        const processedBoards = boardsToSave.map(board => {
          const processedBoard = {
            id: board.id,
            type: board.type,
            title: board.title,
            titleColor: board.titleColor,
          };

          if (board.type === 'classes' || board.type === 'jobs') {
            processedBoard.subBoards = board.subBoards.map(subBoard => ({
              id: subBoard.id,
              title: subBoard.title,
              color: subBoard.color,
              items: subBoard.items || []
            }));
          } else {
            processedBoard.items = board.items || [];
          }

          return processedBoard;
        });

        await setDoc(doc(db, "users", user.uid), { 
          boards: processedBoards,
          userId: user.email?.split('@')[0],
          lastUpdated: new Date().toISOString()
        });
        console.log('=== SAVE COMPLETE ===');
      } catch (error) {
        console.error('Error saving boards:', error);
      }
    },
    [user, isFirebaseInitialized]
  );

  // Save boards to Firestore whenever they change
  useEffect(() => {
    if (user && isFirebaseInitialized) {
      const timeoutId = setTimeout(() => {
        debouncedSave(boards);
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [boards, user, isFirebaseInitialized, debouncedSave]);

  const handleLogin = async (userId, password) => {
    if (!isFirebaseInitialized) {
      alert('Firebase is not initialized. Please check your configuration.');
      return;
    }
    try {
      // Convert userId to email format for Firebase Auth
      const email = `${userId}@tdl.app`;
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  const handleSignup = async (userId, password) => {
    if (!isFirebaseInitialized) {
      alert('Firebase is not initialized. Please check your configuration.');
      return;
    }
    try {
      // Convert userId to email format for Firebase Auth
      const email = `${userId}@tdl.app`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Initialize user's boards with default boards
      await setDoc(doc(db, "users", userCredential.user.uid), { 
        boards: initialBoards,
        userId: userId // Store the original userId
      });
      setIsSignupModalOpen(false);
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    if (!isFirebaseInitialized) {
      alert('Firebase is not initialized. Please check your configuration.');
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed: " + error.message);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewBoardTitle("");
    setNewBoardType("classes");
  };

  // Wrap setBoards to handle undo/redo
  const setBoardsWithUndo = useCallback((updater) => {
    setBoards(prevBoards => {
      setUndoStack(prevUndo => [...prevUndo, prevBoards]);
      setRedoStack([]); // Clear redo stack on new action
      return typeof updater === 'function' ? updater(prevBoards) : updater;
    });
  }, []);

  // Replace all setBoards usage in this file with setBoardsWithUndo, except for initial loads
  // handleAddBoard
  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      const newBoard = {
        id: Date.now(),
        type: newBoardType,
        title: newBoardTitle,
        titleColor: accentColor,
        subBoards: newBoardType === "classes" || newBoardType === "jobs" ? [] : undefined,
        items: newBoardType === "research" || newBoardType === "gig" ? [] : undefined,
      };
      setBoardsWithUndo(prev => [...prev, newBoard]);
      closeModal();
    }
  };

  // handleBoardUpdate
  const handleBoardUpdate = useCallback((updatedBoard) => {
    setBoardsWithUndo(prevBoards =>
      prevBoards.map(board =>
        board.id === updatedBoard.id ? updatedBoard : board
      )
    );
  }, [setBoardsWithUndo]);

  // Undo/Redo handlers
  const handleUndo = () => {
    setUndoStack(prevUndo => {
      if (prevUndo.length === 0) return prevUndo;
      setRedoStack(prevRedo => [boards, ...prevRedo]);
      setBoards(prevUndo[prevUndo.length - 1]);
      return prevUndo.slice(0, -1);
    });
  };
  const handleRedo = () => {
    setRedoStack(prevRedo => {
      if (prevRedo.length === 0) return prevRedo;
      setUndoStack(prevUndo => [...prevUndo, boards]);
      setBoards(prevRedo[0]);
      return prevRedo.slice(1);
    });
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-gray-100 dark:bg-[#111827] transition-colors duration-300">
      <Header
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        onViewAllTodos={() => setIsAllTodosModalOpen(true)}
        user={user}
        onLogin={() => setIsLoginModalOpen(true)}
        onSignup={() => setIsSignupModalOpen(true)}
        onLogout={handleLogout}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-7xl">
        {boards.map(board => (
          <Board
            key={board.id}
            board={board}
            setBoards={setBoardsWithUndo}
            onBoardUpdate={handleBoardUpdate}
            accentColor={accentColor}
          />
        ))}
      </main>

      <Footer accentColor={accentColor} onAddBoard={openModal} />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-heading font-bold mb-4 sm:mb-6 text-center">Create New Board</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Board Title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-[#374151] dark:text-white"
            />
            <select
              value={newBoardType}
              onChange={(e) => setNewBoardType(e.target.value)}
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-[#374151] dark:text-white"
            >
              <option value="classes">Classes</option>
              <option value="jobs">Jobs</option>
              <option value="research">Research</option>
              <option value="gig">Gig</option>
            </select>
            <div className="flex gap-3 justify-center mt-4 sm:mt-6">
              <button 
                onClick={handleAddBoard} 
                className="btn-hover-effect gradient-primary text-white px-4 sm:px-6 py-2 rounded-full transition"
                style={{ '--accent-color': accentColor }}
              >
                Save
              </button>
              <button 
                onClick={closeModal} 
                className="btn-hover-effect bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white px-4 sm:px-6 py-2 rounded-full transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <AllTodosModal
        isOpen={isAllTodosModalOpen}
        onClose={() => setIsAllTodosModalOpen(false)}
        boards={boards}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        accentColor={accentColor}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSignup={handleSignup}
        accentColor={accentColor}
      />
    </div>
  );
};

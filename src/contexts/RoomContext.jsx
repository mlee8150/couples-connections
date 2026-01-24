import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { database } from '../config/firebase';
import { ref, set, onValue, off, push, update, remove, serverTimestamp } from 'firebase/database';

const RoomContext = createContext();

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}

// Generate a random 6-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate a random player ID
function generatePlayerId() {
  return 'player_' + Math.random().toString(36).substring(2, 9);
}

export function RoomProvider({ children }) {
  const [roomCode, setRoomCode] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [playerId] = useState(() => {
    // Try to get existing player ID from session storage, or generate new one
    const stored = sessionStorage.getItem('playerId');
    if (stored) return stored;
    const newId = generatePlayerId();
    sessionStorage.setItem('playerId', newId);
    return newId;
  });
  const [playerName, setPlayerName] = useState(() => {
    return sessionStorage.getItem('playerName') || '';
  });
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Update player name in session storage
  const updatePlayerName = useCallback((name) => {
    setPlayerName(name);
    sessionStorage.setItem('playerName', name);
  }, []);

  // Create a new room
  const createRoom = useCallback(async (gameId) => {
    try {
      setError(null);
      const code = generateRoomCode();
      const roomRef = ref(database, `rooms/${code}`);

      await set(roomRef, {
        gameId,
        hostId: playerId,
        createdAt: serverTimestamp(),
        status: 'waiting', // waiting, playing, finished
        players: {
          [playerId]: {
            name: playerName || 'Player 1',
            joinedAt: serverTimestamp(),
            isHost: true,
          }
        },
        gameState: null,
      });

      setRoomCode(code);
      setIsHost(true);
      setIsConnected(true);
      return code;
    } catch (err) {
      setError('Failed to create room: ' + err.message);
      throw err;
    }
  }, [playerId, playerName]);

  // Join an existing room
  const joinRoom = useCallback(async (code) => {
    try {
      setError(null);
      const upperCode = code.toUpperCase();
      const roomRef = ref(database, `rooms/${upperCode}`);

      // First check if room exists
      return new Promise((resolve, reject) => {
        onValue(roomRef, async (snapshot) => {
          const data = snapshot.val();

          if (!data) {
            setError('Room not found');
            reject(new Error('Room not found'));
            return;
          }

          // Check if room is full (max 2 players)
          const playerCount = data.players ? Object.keys(data.players).length : 0;
          if (playerCount >= 2 && !data.players[playerId]) {
            setError('Room is full');
            reject(new Error('Room is full'));
            return;
          }

          // Add player to room
          const playerRef = ref(database, `rooms/${upperCode}/players/${playerId}`);
          await set(playerRef, {
            name: playerName || 'Player 2',
            joinedAt: serverTimestamp(),
            isHost: false,
          });

          setRoomCode(upperCode);
          setIsHost(false);
          setIsConnected(true);
          resolve(upperCode);
        }, { onlyOnce: true });
      });
    } catch (err) {
      setError('Failed to join room: ' + err.message);
      throw err;
    }
  }, [playerId, playerName]);

  // Leave the current room
  const leaveRoom = useCallback(async () => {
    if (!roomCode) return;

    try {
      const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
      await remove(playerRef);

      // If host leaves, delete the room
      if (isHost) {
        const roomRef = ref(database, `rooms/${roomCode}`);
        await remove(roomRef);
      }

      setRoomCode(null);
      setRoomData(null);
      setIsHost(false);
      setIsConnected(false);
    } catch (err) {
      console.error('Error leaving room:', err);
    }
  }, [roomCode, playerId, isHost]);

  // Update game state in the room
  const updateGameState = useCallback(async (newState) => {
    if (!roomCode) return;

    try {
      const gameStateRef = ref(database, `rooms/${roomCode}/gameState`);
      await update(gameStateRef, newState);
    } catch (err) {
      console.error('Error updating game state:', err);
    }
  }, [roomCode]);

  // Set room status
  const setRoomStatus = useCallback(async (status) => {
    if (!roomCode) return;

    try {
      const statusRef = ref(database, `rooms/${roomCode}/status`);
      await set(statusRef, status);
    } catch (err) {
      console.error('Error setting room status:', err);
    }
  }, [roomCode]);

  // Submit player answer
  const submitAnswer = useCallback(async (questionIndex, answer) => {
    if (!roomCode) return;

    try {
      const answerRef = ref(database, `rooms/${roomCode}/gameState/answers/${questionIndex}/${playerId}`);
      await set(answerRef, {
        answer,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  }, [roomCode, playerId]);

  // Listen to room changes
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(database, `rooms/${roomCode}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        // Room was deleted
        setRoomCode(null);
        setRoomData(null);
        setIsConnected(false);
        setError('Room no longer exists');
        return;
      }

      setRoomData(data);
    });

    return () => {
      off(roomRef);
    };
  }, [roomCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomCode) {
        leaveRoom();
      }
    };
  }, []);

  const value = {
    roomCode,
    roomData,
    playerId,
    playerName,
    updatePlayerName,
    isHost,
    isConnected,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    updateGameState,
    setRoomStatus,
    submitAnswer,
    players: roomData?.players || {},
    gameState: roomData?.gameState || null,
    roomStatus: roomData?.status || 'waiting',
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

export default RoomContext;

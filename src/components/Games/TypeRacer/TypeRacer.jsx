import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, onValue, remove, get } from 'firebase/database';
import { rtdb } from '../../../config/firebase';
import { Button } from '../../shared';
import paragraphs from '../../../data/paragraphs';

function TypeRacer() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Game states: 'lobby', 'waiting', 'countdown', 'playing', 'finished'
  const [gameState, setGameState] = useState('lobby');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState({});
  const [paragraph, setParagraph] = useState('');
  const [typedText, setTypedText] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [winner, setWinner] = useState(null);
  const [playerId, setPlayerId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [rematchReady, setRematchReady] = useState({});
  const [currentRound, setCurrentRound] = useState(0);
  const isHostRef = useRef(false);
  const roomCodeRef = useRef('');
  const startNewRoundRef = useRef(null);
  const currentRoundRef = useRef(0);

  const playerColors = {
    player1: { main: '#E91E63', light: '#F48FB1', name: 'Pink' },
    player2: { main: '#2196F3', light: '#90CAF9', name: 'Blue' }
  };

  // Generate room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create a new room as host
  const createRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name first!');
      return;
    }
    setError('');

    const code = generateRoomCode();
    const id = 'player1';
    setRoomCode(code);
    roomCodeRef.current = code;
    setPlayerId(id);
    setIsHost(true);
    isHostRef.current = true;

    const roomRef = ref(rtdb, `typeracer/${code}`);
    await set(roomRef, {
      host: id,
      gameState: 'waiting',
      paragraph: '',
      players: {
        [id]: {
          name: playerName.trim(),
          progress: 0,
          finished: false,
          isHost: true
        }
      }
    });

    setGameState('waiting');
    listenToRoom(code);
  };

  // Join an existing room
  const joinRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name first!');
      return;
    }
    if (!joinCode.trim()) {
      setError('Please enter a room code!');
      return;
    }
    setError('');
    setIsJoining(true);

    try {
      const code = joinCode.toUpperCase();
      const roomRef = ref(rtdb, `typeracer/${code}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        setError('Room not found!');
        setIsJoining(false);
        return;
      }

      const roomData = snapshot.val();
      if (roomData.players && Object.keys(roomData.players).length >= 2) {
        setError('Room is full!');
        setIsJoining(false);
        return;
      }

      const id = 'player2';
      setRoomCode(code);
      roomCodeRef.current = code;
      setPlayerId(id);
      setIsHost(false);
      isHostRef.current = false;

      await set(ref(rtdb, `typeracer/${code}/players/${id}`), {
        name: playerName.trim(),
        progress: 0,
        finished: false,
        isHost: false
      });

      setGameState('waiting');
      listenToRoom(code);
    } catch (err) {
      setError('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Track previous game state to detect transitions
  const prevFirebaseState = useRef('waiting');

  // Listen to room changes
  const listenToRoom = (code) => {
    const roomRef = ref(rtdb, `typeracer/${code}`);

    onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        setGameState('lobby');
        return;
      }

      const data = snapshot.val();
      setPlayers(data.players || {});

      if (data.paragraph) {
        setParagraph(data.paragraph);
      }

      // Handle game state transitions based on Firebase state
      const firebaseState = data.gameState;

      const firebaseRound = data.round || 0;

      // Sync round number
      setCurrentRound(firebaseRound);

      // Sync rematch ready status
      setRematchReady(data.rematchReady || {});

      // Handle game state transitions
      if (firebaseState === 'countdown') {
        if (gameState !== 'countdown' && gameState !== 'playing') {
          setGameState('countdown');
          setTypedText('');
          setWinner(null);
          // Only start countdown if round changed
          if (firebaseRound > currentRoundRef.current) {
            currentRoundRef.current = firebaseRound;
            startCountdown();
          }
        }
      } else if (firebaseState === 'playing') {
        if (gameState !== 'playing') {
          setGameState('playing');
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      } else if (firebaseState === 'waiting') {
        if (gameState !== 'waiting' && gameState !== 'lobby') {
          setGameState('waiting');
          setTypedText('');
          setWinner(null);
        }
      }

      // Handle winner (only if not already in countdown for new round)
      if (data.winner && firebaseState !== 'countdown') {
        setWinner(data.winner);
        if (gameState !== 'finished') {
          setGameState('finished');
        }
      }

      prevFirebaseState.current = firebaseState;
    });
  };

  // Start countdown
  const startCountdown = () => {
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  // Host starts the game
  const startGame = async () => {
    if (!isHost) return;

    const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];

    await set(ref(rtdb, `typeracer/${roomCode}`), {
      host: 'player1',
      gameState: 'countdown',
      paragraph: randomParagraph,
      players: players,
      winner: null,
      round: 1
    });

    // After countdown, set to playing
    setTimeout(async () => {
      await set(ref(rtdb, `typeracer/${roomCode}/gameState`), 'playing');
    }, 3000);
  };

  // Calculate progress
  const calculateProgress = useCallback((typed, target) => {
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) {
        correct++;
      } else {
        break; // Stop at first error
      }
    }
    return (correct / target.length) * 100;
  }, []);

  // Handle typing
  const handleTyping = async (e) => {
    if (gameState !== 'playing') return;

    const value = e.target.value;
    setTypedText(value);

    const progress = calculateProgress(value, paragraph);

    // Update progress in Firebase
    await set(ref(rtdb, `typeracer/${roomCode}/players/${playerId}/progress`), progress);

    // Check if finished
    if (value === paragraph) {
      await set(ref(rtdb, `typeracer/${roomCode}/players/${playerId}/finished`), true);
      await set(ref(rtdb, `typeracer/${roomCode}/winner`), {
        id: playerId,
        name: players[playerId]?.name
      });
    }
  };

  // Render typed text with colors
  const renderParagraph = () => {
    return paragraph.split('').map((char, index) => {
      let className = 'text-gray-400'; // Not typed yet

      if (index < typedText.length) {
        if (typedText[index] === char) {
          className = 'text-green-600 bg-green-100'; // Correct
        } else {
          className = 'text-red-600 bg-red-200'; // Incorrect
        }
      } else if (index === typedText.length) {
        className = 'text-gray-800 bg-yellow-200'; // Current position
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // Play again - mark this player as ready
  const playAgain = async () => {
    // Mark this player as ready for rematch
    await set(ref(rtdb, `typeracer/${roomCode}/rematchReady/${playerId}`), true);
  };

  // Start new round (called when both players are ready)
  const startNewRound = async (currentPlayers, currentRound = 0) => {
    const code = roomCodeRef.current;
    if (!code) return;

    const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    const newRound = currentRound + 1;

    // Reset players progress using the passed players data
    const resetPlayers = {};
    Object.keys(currentPlayers).forEach(id => {
      resetPlayers[id] = {
        ...currentPlayers[id],
        progress: 0,
        finished: false
      };
    });

    await set(ref(rtdb, `typeracer/${code}`), {
      host: 'player1',
      gameState: 'countdown',
      paragraph: randomParagraph,
      players: resetPlayers,
      winner: null,
      rematchReady: null,
      round: newRound
    });

    // After countdown, set to playing
    setTimeout(async () => {
      await set(ref(rtdb, `typeracer/${code}/gameState`), 'playing');
    }, 3000);
  };

  // Keep ref updated with latest function
  startNewRoundRef.current = startNewRound;

  // Leave room
  const leaveRoom = async () => {
    if (roomCode) {
      if (isHost) {
        await remove(ref(rtdb, `typeracer/${roomCode}`));
      } else {
        await remove(ref(rtdb, `typeracer/${roomCode}/players/${playerId}`));
      }
    }
    setGameState('lobby');
    setRoomCode('');
    setTypedText('');
    setWinner(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomCode && playerId) {
        if (isHost) {
          remove(ref(rtdb, `typeracer/${roomCode}`));
        } else {
          remove(ref(rtdb, `typeracer/${roomCode}/players/${playerId}`));
        }
      }
    };
  }, [roomCode, playerId, isHost]);

  // Handle rematch - when both players are ready, host starts new round
  useEffect(() => {
    const readyCount = Object.keys(rematchReady).length;
    const playerCount = Object.keys(players).length;

    if (readyCount >= 2 && playerCount >= 2 && isHost && gameState === 'finished') {
      startNewRoundRef.current?.(players, currentRound);
    }
  }, [rematchReady, players, isHost, gameState, currentRound]);

  // Dachshund SVG component
  const Dachshund = ({ x, color, flipped = false }) => (
    <g transform={`translate(${x}, 84) ${flipped ? 'scale(-1,1) translate(-50,0)' : ''}`}>
      {/* Body */}
      <ellipse cx="25" cy="20" rx="20" ry="8" fill="#8B4513" />
      {/* Legs */}
      <rect x="8" y="24" width="4" height="12" rx="2" fill="#6B3A0F" />
      <rect x="14" y="25" width="4" height="11" rx="2" fill="#8B4513" />
      <rect x="32" y="24" width="4" height="12" rx="2" fill="#6B3A0F" />
      <rect x="38" y="25" width="4" height="11" rx="2" fill="#8B4513" />
      {/* Head */}
      <ellipse cx="48" cy="16" rx="8" ry="7" fill="#8B4513" />
      {/* Snout */}
      <ellipse cx="55" cy="18" rx="5" ry="4" fill="#A0522D" />
      {/* Nose */}
      <ellipse cx="59" cy="17" rx="2" ry="1.5" fill="#2F1810" />
      {/* Eye */}
      <circle cx="50" cy="14" r="2.5" fill="white" />
      <circle cx="51" cy="14" r="1.5" fill="#2F1810" />
      {/* Ear */}
      <ellipse cx="44" cy="10" rx="4" ry="7" fill="#6B3A0F" />
      {/* Tail */}
      <path d="M5 18 Q-2 14 0 10" stroke="#6B3A0F" strokeWidth="3" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" values="-5 5 18;10 5 18;-5 5 18" dur="0.3s" repeatCount="indefinite" />
      </path>
      {/* Bandana/Handkerchief */}
      <polygon points="42,22 48,18 54,22 48,30" fill={color} />
      <polygon points="44,22 48,19 52,22 48,28" fill={color} opacity="0.8" />
    </g>
  );

  // Race track component
  const RaceTrack = () => {
    const player1Progress = players.player1?.progress || 0;
    const player2Progress = players.player2?.progress || 0;

    // Calculate x positions (start at 50, finish at 700)
    const trackLength = 650;
    const startX = 50;
    const player1X = startX + (player1Progress / 100) * trackLength;
    const player2X = startX + (player2Progress / 100) * trackLength;

    return (
      <svg viewBox="0 0 800 180" className="w-full h-44 md:h-52">
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#E0F4FF" />
          </linearGradient>
        </defs>
        <rect width="800" height="100" fill="url(#skyGradient)" />

        {/* Clouds */}
        <ellipse cx="100" cy="30" rx="40" ry="20" fill="white" opacity="0.8" />
        <ellipse cx="130" cy="35" rx="30" ry="15" fill="white" opacity="0.8" />
        <ellipse cx="600" cy="25" rx="35" ry="18" fill="white" opacity="0.8" />
        <ellipse cx="640" cy="30" rx="25" ry="12" fill="white" opacity="0.8" />

        {/* Sun */}
        <circle cx="720" cy="40" r="25" fill="#FFD700" />
        <circle cx="720" cy="40" r="20" fill="#FFF59D" />

        {/* Grass field */}
        <rect y="100" width="800" height="80" fill="#7CB342" />
        <rect y="100" width="800" height="10" fill="#8BC34A" />

        {/* Grass tufts */}
        {[...Array(30)].map((_, i) => (
          <path
            key={i}
            d={`M${20 + i * 26},180 Q${22 + i * 26},170 ${24 + i * 26},180 Q${26 + i * 26},168 ${28 + i * 26},180`}
            fill="#558B2F"
            opacity="0.6"
          />
        ))}

        {/* Flowers */}
        {[
          { x: 80, y: 130, color: '#E91E63' },
          { x: 150, y: 145, color: '#FF9800' },
          { x: 250, y: 125, color: '#9C27B0' },
          { x: 350, y: 140, color: '#F44336' },
          { x: 450, y: 128, color: '#FFEB3B' },
          { x: 550, y: 142, color: '#E91E63' },
          { x: 650, y: 132, color: '#FF9800' },
          { x: 180, y: 155, color: '#FFEB3B' },
          { x: 320, y: 152, color: '#9C27B0' },
          { x: 500, y: 150, color: '#F44336' },
          { x: 620, y: 155, color: '#FFEB3B' },
        ].map((flower, i) => (
          <g key={i} transform={`translate(${flower.x}, ${flower.y})`}>
            <line x1="0" y1="0" x2="0" y2="15" stroke="#4CAF50" strokeWidth="2" />
            <circle cx="0" cy="0" r="5" fill={flower.color} />
            <circle cx="0" cy="0" r="2" fill="#FFF59D" />
          </g>
        ))}

        {/* Starting line */}
        <rect x="45" y="100" width="4" height="80" fill="white" />
        <text x="47" y="95" fontSize="10" fill="#333" textAnchor="middle">START</text>

        {/* Finish line - checkered pattern */}
        <g>
          {[...Array(8)].map((_, row) => (
            [...Array(2)].map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={700 + col * 10}
                y={100 + row * 10}
                width="10"
                height="10"
                fill={(row + col) % 2 === 0 ? 'white' : 'black'}
              />
            ))
          ))}
        </g>
        <text x="710" y="95" fontSize="10" fill="#333" textAnchor="middle">FINISH</text>

        {/* Race track lanes */}
        <line x1="50" y1="140" x2="700" y2="140" stroke="#5D4037" strokeWidth="2" strokeDasharray="10,5" opacity="0.3" />

        {/* Player 1 Dachshund */}
        {players.player1 && (
          <Dachshund x={player1X} color={playerColors.player1.main} />
        )}

        {/* Player 2 Dachshund */}
        {players.player2 && (
          <g transform="translate(0, 40)">
            <Dachshund x={player2X} color={playerColors.player2.main} />
          </g>
        )}

        {/* Player labels */}
        {players.player1 && (
          <g>
            <rect x={player1X} y="69" width="60" height="16" rx="3" fill={playerColors.player1.main} />
            <text x={player1X + 30} y="80" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">
              {players.player1.name?.substring(0, 8)}
            </text>
          </g>
        )}
        {players.player2 && (
          <g>
            <rect x={player2X} y="159" width="60" height="16" rx="3" fill={playerColors.player2.main} />
            <text x={player2X + 30} y="170" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">
              {players.player2.name?.substring(0, 8)}
            </text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen py-4 px-4" style={{ backgroundColor: '#FBFAF2' }}>
      {/* Back button */}
      <button
        onClick={() => {
          leaveRoom();
          navigate('/');
        }}
        className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-warm-700 font-medium hover:bg-white transition-colors"
      >
        Back to Room
      </button>

      <div className="max-w-4xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2" style={{ color: '#ff91af' }}>
            Type Racer
          </h1>
          <p className="text-warm-600">Race your dachshunds by typing!</p>
        </div>

        {/* Lobby State */}
        {gameState === 'lobby' && (
          <div className="max-w-md mx-auto p-6">
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#ff91af' }}>
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-2xl outline-none transition-all"
                style={{ backgroundColor: '#ffecf2', border: '2px solid #fbcce7' }}
                maxLength={20}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-200">
                {error}
              </div>
            )}

            {!showJoinForm ? (
              <div className="space-y-4">
                <Button
                  onClick={createRoom}
                  className="w-full"
                  size="lg"
                >
                  Create Room
                </Button>

                <Button
                  onClick={() => setShowJoinForm(true)}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  Join Room
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#ff91af' }}>
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 rounded-2xl outline-none transition-all text-center text-2xl tracking-widest font-mono"
                    style={{ backgroundColor: '#ffecf2', border: '2px solid #fbcce7' }}
                    maxLength={6}
                  />
                </div>

                <Button
                  onClick={joinRoom}
                  disabled={isJoining}
                  className="w-full"
                  size="lg"
                >
                  {isJoining ? 'Joining...' : 'Join Room'}
                </Button>

                <Button
                  onClick={() => {
                    setShowJoinForm(false);
                    setJoinCode('');
                    setError('');
                  }}
                  variant="ghost"
                  className="w-full"
                >
                  Back
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Waiting State */}
        {gameState === 'waiting' && (
          <div className="space-y-6">
            <RaceTrack />

            <div className="max-w-md mx-auto">
              {/* Room Code Display */}
              <div className="backdrop-blur-sm rounded-3xl shadow-md p-6 mb-6" style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}>
                <p className="text-sm text-center mb-2" style={{ color: '#ff91af' }}>Room Code</p>
                <p className="text-4xl font-mono font-bold text-center tracking-widest" style={{ color: '#ff91af' }}>
                  {roomCode}
                </p>
                <p className="text-xs text-center mt-2" style={{ color: '#ff91af' }}>
                  Share this code with your partner!
                </p>
              </div>

              {/* Players List */}
              <div className="backdrop-blur-sm rounded-3xl shadow-md p-6 mb-6" style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}>
                <h3 className="text-lg font-semibold text-warm-800 mb-4">Players</h3>
                <div className="space-y-3">
                  {Object.entries(players).map(([id, player]) => (
                    <div
                      key={id}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ backgroundColor: '#fbcce7' }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                        style={{ backgroundColor: playerColors[id]?.main || '#ff91af' }}
                      >
                        {player.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-warm-800">
                          {player.name}
                          {id === playerId && (
                            <span className="text-xs ml-2" style={{ color: '#ff91af' }}>(You)</span>
                          )}
                        </p>
                        {player.isHost && (
                          <p className="text-xs text-warm-500">Host</p>
                        )}
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: playerColors[id]?.main }}
                        title={playerColors[id]?.name + ' bandana'}
                      />
                    </div>
                  ))}

                  {Object.keys(players).length < 2 && (
                    <div className="flex items-center gap-3 p-3 border-2 border-dashed rounded-2xl" style={{ borderColor: '#fbcce7' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fbcce7', color: '#ff91af' }}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p style={{ color: '#ff91af' }}>Waiting for partner...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isHost ? (
                  <Button
                    onClick={startGame}
                    disabled={Object.keys(players).length < 2}
                    className="w-full"
                    size="lg"
                  >
                    {Object.keys(players).length >= 2 ? 'Start Race!' : 'Waiting for partner...'}
                  </Button>
                ) : (
                  <div className="text-center p-4 rounded-2xl" style={{ backgroundColor: '#fbcce7' }}>
                    <p style={{ color: '#ff91af' }}>
                      Waiting for host to start the game...
                    </p>
                  </div>
                )}

                <Button
                  onClick={leaveRoom}
                  variant="ghost"
                  className="w-full text-red-500 hover:bg-red-50"
                >
                  Leave Room
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Countdown State */}
        {gameState === 'countdown' && (
          <div className="space-y-6">
            <RaceTrack />

            <div className="text-center py-12">
              <p className="text-6xl font-bold animate-bounce" style={{ color: '#ff91af' }}>
                {countdown > 0 ? countdown : 'GO!'}
              </p>
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div className="space-y-4">
            <RaceTrack />

            {/* Progress bars */}
            <div className="flex gap-4 px-4">
              {Object.entries(players).map(([id, player]) => (
                <div key={id} className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium" style={{ color: playerColors[id]?.main }}>
                      {player.name}
                    </span>
                    <span className="text-sm text-warm-500">
                      {Math.round(player.progress || 0)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-150"
                      style={{
                        width: `${player.progress || 0}%`,
                        backgroundColor: playerColors[id]?.main
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Paragraph display */}
            <div
              className="p-4 rounded-2xl font-mono text-lg leading-relaxed"
              style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
            >
              {renderParagraph()}
            </div>

            {/* Typing input */}
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleTyping}
              className="w-full p-4 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none font-mono text-lg resize-none"
              rows={4}
              placeholder="Start typing here..."
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
          </div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && winner && (
          <div className="space-y-6">
            <RaceTrack />

            <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#ff91af' }}>
                {winner.name} Wins!
              </h2>

              <div className="text-6xl mb-6">🏆</div>

              {/* Rematch ready status */}
              <div className="mb-6 space-y-2">
                {Object.entries(players).map(([id, player]) => (
                  <div
                    key={id}
                    className="flex items-center justify-center gap-2"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${rematchReady[id] ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className={`text-sm ${rematchReady[id] ? 'text-green-600 font-medium' : 'text-warm-500'}`}>
                      {player.name} {rematchReady[id] ? 'is ready!' : 'not ready'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                {rematchReady[playerId] ? (
                  <div className="px-8 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: '#a8d5a2' }}>
                    Waiting for opponent...
                  </div>
                ) : (
                  <Button
                    onClick={playAgain}
                    size="lg"
                  >
                    Play Again
                  </Button>
                )}
                <Button
                  onClick={leaveRoom}
                  variant="secondary"
                  size="lg"
                >
                  Leave Room
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypeRacer;

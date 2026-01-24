import { useState } from 'react';
import { useRoom } from '../../contexts/RoomContext';
import { Button } from '../shared';

function RoomLobby({ gameId, gameName, onGameStart }) {
  const {
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
    setRoomStatus,
    players,
    roomStatus,
  } = useRoom();

  const [joinCode, setJoinCode] = useState('');
  const [localName, setLocalName] = useState(playerName);
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCreateRoom = async () => {
    if (!localName.trim()) {
      alert('Please enter your name first!');
      return;
    }
    updatePlayerName(localName.trim());
    await createRoom(gameId);
  };

  const handleJoinRoom = async () => {
    if (!localName.trim()) {
      alert('Please enter your name first!');
      return;
    }
    if (!joinCode.trim()) {
      alert('Please enter a room code!');
      return;
    }
    updatePlayerName(localName.trim());
    setIsJoining(true);
    try {
      await joinRoom(joinCode.trim());
    } catch (err) {
      // Error is handled in context
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartGame = async () => {
    await setRoomStatus('playing');
    if (onGameStart) {
      onGameStart();
    }
  };

  const playerList = Object.entries(players);
  const isRoomFull = playerList.length >= 2;
  const canStartGame = isHost && isRoomFull;

  // If game has started, call the callback
  if (roomStatus === 'playing' && !isHost) {
    if (onGameStart) {
      onGameStart();
    }
  }

  // Not in a room yet - show create/join options
  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 font-heading">
          {gameName}
        </h2>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            maxLength={20}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!showJoinForm ? (
          <div className="space-y-4">
            <Button
              onClick={handleCreateRoom}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleJoinRoom}
              disabled={isJoining}
              className="w-full"
              size="lg"
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </Button>

            <Button
              onClick={() => setShowJoinForm(false)}
              variant="ghost"
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    );
  }

  // In a room - show lobby
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2 font-heading">
        {gameName}
      </h2>

      {/* Room Code Display */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <p className="text-sm text-gray-500 text-center mb-2">Room Code</p>
        <p className="text-4xl font-mono font-bold text-pink-500 text-center tracking-widest">
          {roomCode}
        </p>
        <p className="text-xs text-gray-400 text-center mt-2">
          Share this code with your partner!
        </p>
      </div>

      {/* Players List */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Players</h3>
        <div className="space-y-3">
          {playerList.map(([id, player]) => (
            <div
              key={id}
              className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {player.name}
                  {id === playerId && (
                    <span className="text-xs text-pink-500 ml-2">(You)</span>
                  )}
                </p>
                {player.isHost && (
                  <p className="text-xs text-gray-500">Host</p>
                )}
              </div>
            </div>
          ))}

          {!isRoomFull && (
            <div className="flex items-center gap-3 p-3 border-2 border-dashed border-pink-200 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-400">Waiting for partner...</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isHost ? (
          <Button
            onClick={handleStartGame}
            disabled={!canStartGame}
            className="w-full"
            size="lg"
          >
            {canStartGame ? 'Start Game' : 'Waiting for partner...'}
          </Button>
        ) : (
          <div className="text-center p-4 bg-pink-100 rounded-xl">
            <p className="text-pink-700">
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
  );
}

export default RoomLobby;

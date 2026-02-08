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
    const trimmedName = localName.trim();
    updatePlayerName(trimmedName);
    await createRoom(gameId, trimmedName);
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
    const trimmedName = localName.trim();
    updatePlayerName(trimmedName);
    setIsJoining(true);
    try {
      await joinRoom(joinCode.trim(), trimmedName);
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
        <h2 className="text-2xl font-bold text-center mb-6 font-heading" style={{ color: '#ff91af' }}>
          {gameName}
        </h2>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: '#ff91af' }}>
            Your Name
          </label>
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
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
      <h2 className="text-2xl font-bold text-center mb-2 font-heading" style={{ color: '#ff91af' }}>
        {gameName}
      </h2>

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
          {playerList.map(([id, player]) => (
            <div
              key={id}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ backgroundColor: '#fbcce7' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: '#ff91af' }}>
                {player.name.charAt(0).toUpperCase()}
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
            </div>
          ))}

          {!isRoomFull && (
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
            onClick={handleStartGame}
            disabled={!canStartGame}
            className="w-full"
            size="lg"
          >
            {canStartGame ? 'Start Game' : 'Waiting for partner...'}
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
  );
}

export default RoomLobby;

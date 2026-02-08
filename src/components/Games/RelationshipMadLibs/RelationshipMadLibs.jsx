import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../../contexts/RoomContext';
import { RoomLobby } from '../../Room';
import { Button } from '../../shared';
import templates from '../../../data/madLibsTemplates.json';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function RelationshipMadLibs() {
  const navigate = useNavigate();
  const {
    isHost,
    playerId,
    players,
    gameState,
    updateGameState,
    submitAnswer,
    roomStatus,
  } = useRoom();

  const [gamePhase, setGamePhase] = useState('lobby');
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [myBlanks, setMyBlanks] = useState([]);
  const [myAnswers, setMyAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleGameStart = async () => {
    if (isHost) {
      const shuffled = shuffleArray(templates.templates);
      const selected = shuffled[0];

      await updateGameState({
        template: selected,
        phase: 'filling',
        answers: {},
        storyIndex: 0,
      });
    }
    setGamePhase('filling');
  };

  // Sync game state from Firebase
  useEffect(() => {
    if (gameState?.template) {
      setCurrentTemplate(gameState.template);

      // Assign blanks to players
      const playerIds = Object.keys(players).sort();
      const myIndex = playerIds.indexOf(playerId);
      const blanks = gameState.template.blanks || [];

      const assigned = blanks.filter((_, idx) => idx % 2 === myIndex);
      setMyBlanks(assigned);
    }

    if (gameState?.phase === 'reveal' && gamePhase === 'filling') {
      setGamePhase('reveal');
    }

    if (gameState?.phase === 'filling' && gamePhase === 'reveal') {
      // New story started
      setGamePhase('filling');
      setMyAnswers({});
      setSubmitted(false);
    }
  }, [gameState, players, playerId, gamePhase]);

  useEffect(() => {
    if (roomStatus === 'playing' && gamePhase === 'lobby') {
      setGamePhase('filling');
    }
  }, [roomStatus, gamePhase]);

  // Check if all players submitted
  useEffect(() => {
    if (gameState?.phase === 'filling' && gameState?.answers?.blanks) {
      const playerIds = Object.keys(players);
      const allSubmitted = playerIds.every(pid => gameState.answers.blanks[pid]?.answer?.submitted);

      if (allSubmitted && playerIds.length > 0 && isHost) {
        updateGameState({ phase: 'reveal' });
      }
    }
  }, [gameState?.answers, players, isHost]);

  const handleInputChange = (blankId, value) => {
    setMyAnswers(prev => ({ ...prev, [blankId]: value }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    setSubmitted(true);
    await submitAnswer('blanks', { ...myAnswers, submitted: true });
  };

  const handleNextStory = async () => {
    const shuffled = shuffleArray(templates.templates);
    const selected = shuffled[0];

    setMyAnswers({});
    setSubmitted(false);
    setCurrentTemplate(selected);
    setGamePhase('filling');

    await updateGameState({
      template: selected,
      phase: 'filling',
      answers: {},
      storyIndex: (gameState?.storyIndex || 0) + 1,
    });
  };

  const getFilledStory = () => {
    if (!currentTemplate || !gameState?.answers?.blanks) return '';

    let story = currentTemplate.story;
    const allAnswers = {};

    // Collect all answers from all players
    Object.values(gameState.answers.blanks).forEach(playerData => {
      const playerAnswers = playerData?.answer || {};
      Object.entries(playerAnswers).forEach(([key, value]) => {
        if (key !== 'submitted') {
          allAnswers[key] = value;
        }
      });
    });

    // Replace blanks with answers
    currentTemplate.blanks.forEach(blank => {
      const answer = allAnswers[blank.id] || '___';
      story = story.replace(`{${blank.id}}`, `**${answer}**`);
    });

    return story;
  };

  const getBlankContributor = (blankId) => {
    if (!gameState?.answers) return null;

    const playerIds = Object.keys(players).sort();
    const blankIndex = currentTemplate.blanks.findIndex(b => b.id === blankId);
    const contributorIndex = blankIndex % 2;
    const contributorId = playerIds[contributorIndex];

    return players[contributorId]?.name || 'Player';
  };

  // Lobby phase
  if (gamePhase === 'lobby') {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#FBFAF2' }}>
        <RoomLobby
          gameId="relationship-mad-libs"
          gameName="Relationship Mad Libs"
          onGameStart={handleGameStart}
        />
      </div>
    );
  }

  // Filling phase
  if (gamePhase === 'filling') {
    const allFilled = myBlanks.every(blank => myAnswers[blank.id]?.trim());

    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FBFAF2' }}>
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2 font-heading" style={{ color: '#ff91af' }}>
            Fill in the Blanks!
          </h2>
          <p className="text-center mb-6 text-sm" style={{ color: '#ff91af' }}>
            Your partner is filling in the other blanks
          </p>

          {!submitted ? (
            <>
              <div className="space-y-4 mb-6">
                {myBlanks.map((blank, idx) => (
                  <div
                    key={blank.id}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
                  >
                    <label className="block text-sm font-medium mb-2" style={{ color: '#ff91af' }}>
                      Blank {idx + 1}: {blank.prompt}
                    </label>
                    <input
                      type="text"
                      value={myAnswers[blank.id] || ''}
                      onChange={(e) => handleInputChange(blank.id, e.target.value)}
                      placeholder={`Enter a ${blank.type}...`}
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: '#fbcce7',
                        backgroundColor: 'white',
                      }}
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!allFilled}
                className="w-full"
                size="lg"
              >
                Submit My Words
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <div
                className="rounded-xl p-6 mb-4"
                style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
              >
                <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: '#ff91af', borderTopColor: 'transparent' }}></div>
                <p style={{ color: '#ff91af' }}>Waiting for your partner to finish...</p>
              </div>

              <p className="text-sm" style={{ color: '#999' }}>
                You submitted: {Object.values(myAnswers).filter(v => v).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Reveal phase
  if (gamePhase === 'reveal') {
    const filledStory = getFilledStory();

    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FBFAF2' }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 font-heading" style={{ color: '#ff91af' }}>
            Your Story!
          </h2>

          <div
            className="rounded-2xl p-6 mb-6 shadow-lg"
            style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
          >
            <p className="text-lg leading-relaxed text-gray-800">
              {filledStory.split('**').map((part, idx) => (
                idx % 2 === 1 ? (
                  <span
                    key={idx}
                    className="font-bold px-1 rounded"
                    style={{ backgroundColor: '#fbcce7', color: '#ff91af' }}
                  >
                    {part}
                  </span>
                ) : (
                  <span key={idx}>{part}</span>
                )
              ))}
            </p>
          </div>

          <div
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
          >
            <h3 className="text-sm font-medium mb-3" style={{ color: '#ff91af' }}>
              Who wrote what:
            </h3>
            <div className="space-y-2">
              {currentTemplate?.blanks.map(blank => {
                const contributor = getBlankContributor(blank.id);
                const allAnswers = {};
                Object.values(gameState?.answers?.blanks || {}).forEach(playerData => {
                  const pa = playerData?.answer || {};
                  Object.entries(pa).forEach(([k, v]) => {
                    if (k !== 'submitted') allAnswers[k] = v;
                  });
                });

                return (
                  <div key={blank.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{blank.prompt}:</span>
                    <span className="font-medium">
                      <span style={{ color: '#ff91af' }}>{allAnswers[blank.id]}</span>
                      <span className="text-gray-400 ml-2">({contributor})</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleNextStory} className="w-full" size="lg">
              Next Story
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBFAF2' }}>
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: '#ff91af', borderTopColor: 'transparent' }}></div>
        <p style={{ color: '#ff91af' }}>Loading...</p>
      </div>
    </div>
  );
}

export default RelationshipMadLibs;

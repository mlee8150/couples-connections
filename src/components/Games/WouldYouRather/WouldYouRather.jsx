import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../../contexts/RoomContext';
import { RoomLobby } from '../../Room';
import { Button, Heart, ProgressBar } from '../../shared';
import questions from '../../../data/wouldYouRatherQuestions.json';

const TOTAL_QUESTIONS = 10;

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function WouldYouRather() {
  const navigate = useNavigate();
  const {
    isConnected,
    isHost,
    playerId,
    players,
    gameState,
    updateGameState,
    submitAnswer,
    roomStatus,
  } = useRoom();

  const [gamePhase, setGamePhase] = useState('lobby'); // lobby, playing, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHeart, setShowHeart] = useState(false);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [localAnswers, setLocalAnswers] = useState({});

  // Initialize game when starting
  const handleGameStart = async () => {
    if (isHost) {
      // Host selects random questions
      const shuffled = shuffleArray(questions.questions);
      const selected = shuffled.slice(0, TOTAL_QUESTIONS);

      await updateGameState({
        questions: selected,
        currentIndex: 0,
        answers: {},
      });
    }
    setGamePhase('playing');
  };

  // Sync game state from Firebase
  useEffect(() => {
    if (gameState?.questions) {
      setGameQuestions(gameState.questions);
    }
    if (gameState?.currentIndex !== undefined && gameState.currentIndex !== currentQuestionIndex) {
      // Reset local state when question changes (synced from host)
      setCurrentQuestionIndex(gameState.currentIndex);
      setSelectedAnswer(null);
      setShowHeart(false);
    }
  }, [gameState, currentQuestionIndex]);

  // Check if game phase changed (results or playing again)
  useEffect(() => {
    if (gameState?.phase === 'results' && gamePhase === 'playing') {
      setGamePhase('results');
    }
    // Handle play again - sync non-host player back to playing
    if (gameState?.phase === 'playing' && gamePhase === 'results') {
      setGamePhase('playing');
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowHeart(false);
      setLocalAnswers({});
    }
  }, [gameState?.phase, gamePhase]);

  // Check room status for non-host
  useEffect(() => {
    if (roomStatus === 'playing' && gamePhase === 'lobby') {
      setGamePhase('playing');
    }
  }, [roomStatus, gamePhase]);

  const handleAnswerSelect = async (option) => {
    if (selectedAnswer) return; // Already answered

    setSelectedAnswer(option);
    setShowHeart(true);

    // Save locally
    setLocalAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));

    // Submit to Firebase
    await submitAnswer(currentQuestionIndex, option);
  };

  const handleNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= TOTAL_QUESTIONS) {
      // Update game state to results phase so all players sync
      await updateGameState({
        phase: 'results',
      });
      setGamePhase('results');
      return;
    }

    // Update the shared game state - all players will sync to this
    await updateGameState({
      currentIndex: nextIndex,
    });

    // Local state will be reset by the useEffect when gameState.currentIndex changes
  };

  const handlePlayAgain = async () => {
    // Generate new set of questions
    const shuffled = shuffleArray(questions.questions);
    const selected = shuffled.slice(0, TOTAL_QUESTIONS);

    // Reset local state
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowHeart(false);
    setLocalAnswers({});
    setGameQuestions(selected);
    setGamePhase('playing');

    // Update Firebase with new questions - both players will sync
    await updateGameState({
      questions: selected,
      currentIndex: 0,
      answers: {},
      phase: 'playing',
    });
  };

  // Get partner's answers from game state
  const getPartnerAnswer = (questionIndex) => {
    if (!gameState?.answers?.[questionIndex]) return null;
    const answers = gameState.answers[questionIndex];
    for (const [pid, data] of Object.entries(answers)) {
      if (pid !== playerId) {
        return data.answer;
      }
    }
    return null;
  };

  // Check if all players have answered the current question
  const allPlayersAnswered = () => {
    if (!gameState?.answers?.[currentQuestionIndex]) return false;
    const answers = gameState.answers[currentQuestionIndex];
    const playerCount = Object.keys(players).length;
    const answerCount = Object.keys(answers).length;
    return answerCount >= playerCount && playerCount > 0;
  };

  // Check if current player has answered
  const hasPlayerAnswered = () => {
    if (!gameState?.answers?.[currentQuestionIndex]) return false;
    return !!gameState.answers[currentQuestionIndex][playerId];
  };

  // Lobby phase
  if (gamePhase === 'lobby') {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#FBFAF2' }}>
        <RoomLobby
          gameId="would-you-rather"
          gameName="Would You Rather"
          onGameStart={handleGameStart}
        />
      </div>
    );
  }

  // Results phase
  if (gamePhase === 'results') {
    const playerList = Object.entries(players);

    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FBFAF2' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 font-heading" style={{ color: '#ff91af' }}>
            Game Complete!
          </h2>

          <div className="space-y-4 mb-8">
            {gameQuestions.map((q, index) => {
              const myAnswer = localAnswers[index];
              const partnerAnswer = getPartnerAnswer(index);

              return (
                <div key={q.id} className="rounded-xl shadow-md p-4" style={{ backgroundColor: '#ffecf2', borderColor: '#fbcce7', borderWidth: '1px' }}>
                  <p className="text-sm mb-2" style={{ color: '#ff91af' }}>Question {index + 1}</p>
                  <p className="font-medium text-warm-800 mb-3">{q.question}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg text-sm`} style={{ backgroundColor: myAnswer === 'A' ? '#fbcce7' : '#FBFAF2', border: myAnswer === 'A' ? '2px solid #ff91af' : '1px solid #fbcce7' }}>
                      <p className="font-medium mb-1">{q.optionA}</p>
                      <div className="flex gap-1 flex-wrap">
                        {myAnswer === 'A' && (
                          <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ff91af' }}>You</span>
                        )}
                        {partnerAnswer === 'A' && (
                          <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Partner</span>
                        )}
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg text-sm`} style={{ backgroundColor: myAnswer === 'B' ? '#fbcce7' : '#FBFAF2', border: myAnswer === 'B' ? '2px solid #ff91af' : '1px solid #fbcce7' }}>
                      <p className="font-medium mb-1">{q.optionB}</p>
                      <div className="flex gap-1 flex-wrap">
                        {myAnswer === 'B' && (
                          <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ff91af' }}>You</span>
                        )}
                        {partnerAnswer === 'B' && (
                          <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Partner</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handlePlayAgain} className="flex-1" size="lg">
              Play Again
            </Button>
            <Button onClick={() => navigate('/')} variant="secondary" className="flex-1" size="lg">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  const currentQuestion = gameQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBFAF2' }}>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: '#ff91af', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#ff91af' }}>Loading questions...</p>
        </div>
      </div>
    );
  }

  const everyoneAnswered = allPlayersAnswered();
  const partnerAnswer = everyoneAnswered ? getPartnerAnswer(currentQuestionIndex) : null;

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FBFAF2' }}>
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar current={currentQuestionIndex + 1} total={TOTAL_QUESTIONS} />
        </div>

        {/* Question Card */}
        <div className="rounded-2xl shadow-lg p-6 mb-6 animate-slide-up" style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}>
          <h2 className="text-2xl font-bold text-warm-800 text-center mb-6 font-heading">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            <button
              onClick={() => handleAnswerSelect('A')}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${everyoneAnswered && partnerAnswer === 'A' ? 'ring-2 ring-purple-400' : ''}`}
              style={{
                backgroundColor: selectedAnswer === 'A' ? '#fbcce7' : selectedAnswer ? '#FBFAF2' : 'white',
                border: selectedAnswer === 'A' ? '2px solid #ff91af' : '2px solid #fbcce7',
                opacity: selectedAnswer && selectedAnswer !== 'A' ? 0.6 : 1
              }}
            >
              <p className="font-medium text-warm-800">{currentQuestion.optionA}</p>
              {selectedAnswer === 'A' && (
                <div className="flex items-center gap-2 mt-2">
                  <Heart size="sm" animated={showHeart} />
                  <span className="text-sm" style={{ color: '#ff91af' }}>Your choice</span>
                </div>
              )}
              {everyoneAnswered && partnerAnswer === 'A' && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-purple-500">Partner chose this!</span>
                </div>
              )}
            </button>

            <button
              onClick={() => handleAnswerSelect('B')}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${everyoneAnswered && partnerAnswer === 'B' ? 'ring-2 ring-purple-400' : ''}`}
              style={{
                backgroundColor: selectedAnswer === 'B' ? '#fbcce7' : selectedAnswer ? '#FBFAF2' : 'white',
                border: selectedAnswer === 'B' ? '2px solid #ff91af' : '2px solid #fbcce7',
                opacity: selectedAnswer && selectedAnswer !== 'B' ? 0.6 : 1
              }}
            >
              <p className="font-medium text-warm-800">{currentQuestion.optionB}</p>
              {selectedAnswer === 'B' && (
                <div className="flex items-center gap-2 mt-2">
                  <Heart size="sm" animated={showHeart} />
                  <span className="text-sm" style={{ color: '#ff91af' }}>Your choice</span>
                </div>
              )}
              {everyoneAnswered && partnerAnswer === 'B' && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-purple-500">Partner chose this!</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Waiting for partner */}
        {selectedAnswer && !everyoneAnswered && (
          <div className="animate-fade-in text-center py-4">
            <div className="flex items-center justify-center gap-2" style={{ color: '#ff91af' }}>
              <div className="animate-spin w-5 h-5 border-2 border-t-transparent rounded-full" style={{ borderColor: '#ff91af', borderTopColor: 'transparent' }}></div>
              <span>Waiting for partner to choose...</span>
            </div>
          </div>
        )}

        {/* Next Button - only shows when everyone has answered */}
        {everyoneAnswered && (
          <div className="animate-fade-in">
            <Button onClick={handleNextQuestion} className="w-full" size="lg">
              {currentQuestionIndex < TOTAL_QUESTIONS - 1 ? 'Next Question' : 'See Results'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WouldYouRather;

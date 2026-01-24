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
    if (gameState?.currentIndex !== undefined) {
      setCurrentQuestionIndex(gameState.currentIndex);
    }
  }, [gameState]);

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
      setGamePhase('results');
      return;
    }

    setSelectedAnswer(null);
    setShowHeart(false);
    setCurrentQuestionIndex(nextIndex);

    // Host updates the shared game state
    if (isHost) {
      await updateGameState({
        currentIndex: nextIndex,
      });
    }
  };

  const handlePlayAgain = () => {
    setGamePhase('lobby');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowHeart(false);
    setLocalAnswers({});
    setGameQuestions([]);
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

  // Lobby phase
  if (gamePhase === 'lobby') {
    return (
      <div className="min-h-screen bg-pink-50 py-8">
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
      <div className="min-h-screen bg-pink-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 font-heading">
            Game Complete!
          </h2>

          <div className="space-y-4 mb-8">
            {gameQuestions.map((q, index) => {
              const myAnswer = localAnswers[index];
              const partnerAnswer = getPartnerAnswer(index);

              return (
                <div key={q.id} className="bg-white rounded-xl shadow-md p-4">
                  <p className="text-sm text-gray-500 mb-2">Question {index + 1}</p>
                  <p className="font-medium text-gray-800 mb-3">{q.question}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg text-sm ${myAnswer === 'A' ? 'bg-pink-100 border-2 border-pink-400' : 'bg-gray-50'}`}>
                      <p className="font-medium mb-1">{q.optionA}</p>
                      <div className="flex gap-1 flex-wrap">
                        {myAnswer === 'A' && (
                          <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">You</span>
                        )}
                        {partnerAnswer === 'A' && (
                          <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Partner</span>
                        )}
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg text-sm ${myAnswer === 'B' ? 'bg-pink-100 border-2 border-pink-400' : 'bg-gray-50'}`}>
                      <p className="font-medium mb-1">{q.optionB}</p>
                      <div className="flex gap-1 flex-wrap">
                        {myAnswer === 'B' && (
                          <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">You</span>
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
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const partnerAnswer = getPartnerAnswer(currentQuestionIndex);

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar current={currentQuestionIndex + 1} total={TOTAL_QUESTIONS} />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 font-heading">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            <button
              onClick={() => handleAnswerSelect('A')}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                selectedAnswer === 'A'
                  ? 'bg-pink-100 border-2 border-pink-500'
                  : selectedAnswer
                  ? 'bg-gray-50 border-2 border-gray-200 opacity-60'
                  : 'bg-white border-2 border-pink-200 hover:border-pink-400 hover:shadow-md'
              }`}
            >
              <p className="font-medium text-gray-800">{currentQuestion.optionA}</p>
              {selectedAnswer === 'A' && (
                <div className="flex items-center gap-2 mt-2">
                  <Heart size="sm" animated={showHeart} />
                  <span className="text-sm text-pink-500">Your choice</span>
                </div>
              )}
              {partnerAnswer === 'A' && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-purple-500">Partner chose this!</span>
                </div>
              )}
            </button>

            <button
              onClick={() => handleAnswerSelect('B')}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                selectedAnswer === 'B'
                  ? 'bg-pink-100 border-2 border-pink-500'
                  : selectedAnswer
                  ? 'bg-gray-50 border-2 border-gray-200 opacity-60'
                  : 'bg-white border-2 border-pink-200 hover:border-pink-400 hover:shadow-md'
              }`}
            >
              <p className="font-medium text-gray-800">{currentQuestion.optionB}</p>
              {selectedAnswer === 'B' && (
                <div className="flex items-center gap-2 mt-2">
                  <Heart size="sm" animated={showHeart} />
                  <span className="text-sm text-pink-500">Your choice</span>
                </div>
              )}
              {partnerAnswer === 'B' && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-purple-500">Partner chose this!</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Next Button */}
        {selectedAnswer && (
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

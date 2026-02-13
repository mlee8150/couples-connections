import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const OPEN_WHEN_OPTIONS = [
  "you can't fall asleep",
  "you're procrastinating",
  "you miss me",
  "you want a laugh",
  "you want to daydream about our future",
  "you've accomplished something awesome",
  "you're having a bad day",

  "you need a reminder of us",

];

function LoveLetters() {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [viewingMailbox, setViewingMailbox] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [savedLetters, setSavedLetters] = useState([]);
  const [readingLetter, setReadingLetter] = useState(null);
  const [letterData, setLetterData] = useState({
    to: '',
    openWhen: '',
    customOpenWhen: '',
    content: '',
  });

  // Load letters from Firestore on mount
  useEffect(() => {
    const loadLetters = async () => {
      try {
        const lettersRef = collection(db, 'letters');
        const q = query(lettersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const letters = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedLetters(letters);
      } catch (error) {
        console.error('Error loading letters:', error);
      }
    };
    loadLetters();
  }, []);

  const handleWriteLetter = () => {
    setIsWriting(true);
  };

  const handleCloseWriting = () => {
    setIsWriting(false);
    setIsSaving(false);
    setAnimationStage(0);
  };

  const handleInputChange = (field, value) => {
    setLetterData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveLetter = () => {
    setIsSaving(true);
    setAnimationStage(1); // Start folding paper

    // Animation sequence timing
    setTimeout(() => setAnimationStage(2), 1000);  // Envelope slides in
    setTimeout(() => setAnimationStage(3), 1800);  // Envelope opens
    setTimeout(() => setAnimationStage(4), 2500);  // Paper goes in
    setTimeout(() => setAnimationStage(5), 3200);  // Envelope closes
    setTimeout(() => setAnimationStage(6), 3900);  // Wax seal stamps
    setTimeout(() => {
      setAnimationStage(7); // Complete
      // Save the letter to Firestore and reset after showing complete state
      setTimeout(async () => {
        try {
          const newLetter = {
            to: letterData.to,
            openWhen: letterData.openWhen === 'custom' ? letterData.customOpenWhen : letterData.openWhen,
            content: letterData.content,
            createdAt: serverTimestamp(),
          };
          const docRef = await addDoc(collection(db, 'letters'), newLetter);
          setSavedLetters(prev => [...prev, { id: docRef.id, ...newLetter, createdAt: new Date() }]);
        } catch (error) {
          console.error('Error saving letter:', error);
        }
        setIsWriting(false);
        setIsSaving(false);
        setAnimationStage(0);
        setLetterData({ to: '', openWhen: '', customOpenWhen: '', content: '' });
      }, 1500);
    }, 4800);
  };

  const handleReadLetter = (letter) => {
    setReadingLetter(letter);
  };

  const handleCloseReading = () => {
    setReadingLetter(null);
    // Stay on the mailbox view if we were viewing one
  };

  const handleDeleteLetter = async (e, letter) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this letter?')) return;
    try {
      await deleteDoc(doc(db, 'letters', letter.id));
      setSavedLetters(prev => prev.filter(l => l.id !== letter.id));
    } catch (error) {
      console.error('Error deleting letter:', error);
    }
  };

  // Reading letter view
  if (readingLetter) {
    return (
      <div className="min-h-screen bg-amber-800 flex items-center justify-center p-4">
        {/* Back button */}
        <button
          onClick={handleCloseReading}
          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-warm-700 font-medium hover:bg-white transition-colors"
        >
          Back
        </button>

        {/* Letter paper - romantic stationery */}
        <div className="bg-[#FDF8F5] w-full max-w-2xl min-h-[70vh] rounded-lg shadow-2xl p-8 md:p-12 relative animate-fade-in overflow-hidden">
          {/* Subtle decorative border */}
          <div className="absolute inset-4 border border-rose-200/50 rounded-lg pointer-events-none" />
          <div className="absolute inset-6 border border-rose-100/30 rounded-lg pointer-events-none" />

          {/* Corner flourishes */}
          <svg className="absolute top-4 left-4 w-16 h-16 text-rose-200/60" viewBox="0 0 60 60">
            <path d="M5 55 Q5 5 55 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 50 Q10 10 50 10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
          </svg>
          <svg className="absolute top-4 right-4 w-16 h-16 text-rose-200/60 transform scale-x-[-1]" viewBox="0 0 60 60">
            <path d="M5 55 Q5 5 55 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 50 Q10 10 50 10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
          </svg>
          <svg className="absolute bottom-4 left-4 w-16 h-16 text-rose-200/60 transform scale-y-[-1]" viewBox="0 0 60 60">
            <path d="M5 55 Q5 5 55 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 50 Q10 10 50 10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
          </svg>
          <svg className="absolute bottom-4 right-4 w-16 h-16 text-rose-200/60 transform scale-[-1]" viewBox="0 0 60 60">
            <path d="M5 55 Q5 5 55 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 50 Q10 10 50 10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
          </svg>

          {/* Subtle watermark heart in center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <svg className="w-64 h-64" viewBox="0 0 100 100">
              <path d="M50 88 C20 60, 0 40, 20 20 C35 5, 50 15, 50 30 C50 15, 65 5, 80 20 C100 40, 80 60, 50 88Z" fill="#ff91af" />
            </svg>
          </div>

          {/* Letter content */}
          <div className="relative z-10 space-y-6">
            {/* To field */}
            <div className="flex items-center gap-4">
              <span className="text-xl font-heading font-semibold text-warm-800">To:</span>
              <span className="text-xl text-warm-700">{readingLetter.to}</span>
            </div>

            {/* Open when field */}
            <div className="flex flex-col gap-1">
              <span className="text-xl font-heading font-semibold text-warm-800">Open when...</span>
              <span className="text-lg text-warm-700 italic">{readingLetter.openWhen}</span>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 pt-4" />

            {/* Letter body */}
            <div
              className="text-warm-800 font-medium whitespace-pre-wrap min-h-[30vh]"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, rgba(255, 145, 175, 0.1) 35px, rgba(255, 145, 175, 0.1) 36px)',
                backgroundPosition: '0 31px',
                lineHeight: '36px',
                paddingTop: '4px',
              }}
            >
              {readingLetter.content}
            </div>

            {/* Delete button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={(e) => {
                  handleDeleteLetter(e, readingLetter);
                  setReadingLetter(null);
                }}
                className="px-5 py-2 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                Delete Letter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Saving animation
  if (isSaving) {
    return (
      <div className="min-h-screen bg-amber-800 flex items-center justify-center p-4 overflow-hidden">
        <style>{`
          @keyframes foldPaper {
            0% { transform: scaleY(1) rotateX(0deg); }
            50% { transform: scaleY(0.7) rotateX(0deg); }
            100% { transform: scaleY(0.5) rotateX(0deg); }
          }

          @keyframes slideInEnvelope {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(0); }
          }

          @keyframes openEnvelope {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(180deg); }
          }

          @keyframes paperIntoEnvelope {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(60px) scale(0.8); opacity: 0; }
          }

          @keyframes closeEnvelope {
            0% { transform: rotateX(180deg); }
            100% { transform: rotateX(0deg); }
          }

          @keyframes stampSeal {
            0% { transform: scale(3) translateY(-100px); opacity: 0; }
            50% { transform: scale(1.2) translateY(0); opacity: 1; }
            70% { transform: scale(0.9) translateY(0); }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }

          @keyframes completePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .fold-paper {
            animation: foldPaper 1s ease-in-out forwards;
            transform-origin: center center;
          }

          .slide-envelope {
            animation: slideInEnvelope 0.8s ease-out forwards;
          }

          .open-flap {
            animation: openEnvelope 0.7s ease-in-out forwards;
            transform-origin: top center;
          }

          .paper-enter {
            animation: paperIntoEnvelope 0.7s ease-in forwards;
          }

          .close-flap {
            animation: closeEnvelope 0.7s ease-in-out forwards;
            transform-origin: top center;
          }

          .stamp-seal {
            animation: stampSeal 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .complete-pulse {
            animation: completePulse 0.5s ease-in-out infinite;
          }
        `}</style>

        <div className="relative w-80 h-96 flex items-center justify-center">
          {/* Folding Paper - Stages 1-4 */}
          {animationStage >= 1 && animationStage <= 4 && (
            <div
              className={`absolute bg-[#FFFEF9] w-48 h-64 rounded shadow-lg flex items-center justify-center
                ${animationStage === 1 ? 'fold-paper' : ''}
                ${animationStage >= 4 ? 'paper-enter' : ''}
              `}
              style={{
                transform: animationStage >= 2 && animationStage < 4 ? 'scaleY(0.5)' : undefined,
                zIndex: 30,
              }}
            >
              {animationStage === 1 && (
                <div className="text-warm-400 text-sm">Your letter...</div>
              )}
            </div>
          )}

          {/* Envelope - Stages 2+ */}
          {animationStage >= 2 && (
            <div
              className={`absolute ${animationStage === 2 ? 'slide-envelope' : ''}`}
              style={{ zIndex: animationStage >= 4 ? 40 : 20 }}
            >
              <svg width="240" height="180" viewBox="0 0 240 180">
                {/* Envelope body */}
                <rect x="10" y="40" width="220" height="130" rx="4" fill="#FFF8DC" stroke="#DEB887" strokeWidth="2" />

                {/* Envelope back flap (bottom part visible) */}
                <path d="M10 40 L120 100 L230 40" fill="#FFF8DC" stroke="#DEB887" strokeWidth="2" />

                {/* Envelope front flap */}
                <g
                  className={`
                    ${animationStage === 3 ? 'open-flap' : ''}
                    ${animationStage === 5 ? 'close-flap' : ''}
                  `}
                  style={{
                    transformOrigin: '120px 40px',
                    transform: animationStage === 4 ? 'rotateX(180deg)' : animationStage >= 5 ? 'rotateX(0deg)' : undefined,
                  }}
                >
                  <path d="M10 40 L120 110 L230 40 Z" fill="#FFFEF0" stroke="#DEB887" strokeWidth="2" />
                </g>

                {/* Wax seal - Stage 6+ */}
                {animationStage >= 6 && (
                  <g className={animationStage === 6 ? 'stamp-seal' : ''}>
                    {/* Seal base */}
                    <circle cx="120" cy="110" r="22" fill="#DC143C" />
                    <circle cx="120" cy="110" r="18" fill="#B22222" />
                    {/* Heart on seal */}
                    <path
                      d="M120 103 C115 98, 108 103, 112 109 L120 117 L128 109 C132 103, 125 98, 120 103"
                      fill="#FFB6C1"
                    />
                    {/* Seal shine */}
                    <ellipse cx="113" cy="103" rx="4" ry="3" fill="#FF6B6B" opacity="0.5" />
                  </g>
                )}
              </svg>
            </div>
          )}

          {/* Completion message */}
          {animationStage === 7 && (
            <div className="absolute bottom-0 text-white text-xl font-heading animate-fade-in">
              Letter Saved!
            </div>
          )}
        </div>
      </div>
    );
  }

  // Writing interface
  if (isWriting) {
    return (
      <div className="min-h-screen bg-amber-800 flex items-center justify-center p-4">
        {/* Back button */}
        <button
          onClick={handleCloseWriting}
          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-warm-700 font-medium hover:bg-white transition-colors"
        >
          Back
        </button>

        {/* Romantic stationery paper */}
        <div className="bg-[#FDF8F5] w-full max-w-2xl min-h-[80vh] rounded-lg shadow-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Subtle decorative border */}
          <div className="absolute inset-4 border border-rose-200/50 rounded-lg pointer-events-none" />
          <div className="absolute inset-6 border border-rose-100/30 rounded-lg pointer-events-none" />

          {/* Corner flourishes */}
          <svg className="absolute top-4 left-4 w-16 h-16 text-rose-200/60" viewBox="0 0 60 60">
            <path d="M5 55 Q5 5 55 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 50 Q10 10 50 10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
          </svg>
          <svg className="absolute top-4 right-4 w-16 h-16 text-rose-200/60 transform scale-x-[-1]" viewBox="0 0 60 60">
            <path d="M5 55 Q5 5 55 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 50 Q10 10 50 10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
          </svg>
          <svg className="absolute bottom-4 left-4 w-16 h-16 text-rose-200/60 transform scale-y-[-1]" viewBox="0 0 60 60">
            <path d="M5 55 Q5 5 55 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 50 Q10 10 50 10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
          </svg>
          <svg className="absolute bottom-4 right-4 w-16 h-16 text-rose-200/60 transform scale-[-1]" viewBox="0 0 60 60">
            <path d="M5 55 Q5 5 55 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 50 Q10 10 50 10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
          </svg>

          {/* Subtle watermark heart in center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <svg className="w-64 h-64" viewBox="0 0 100 100">
              <path d="M50 88 C20 60, 0 40, 20 20 C35 5, 50 15, 50 30 C50 15, 65 5, 80 20 C100 40, 80 60, 50 88Z" fill="#ff91af" />
            </svg>
          </div>

          {/* Letter content */}
          <div className="relative z-10 space-y-6">
            {/* To field */}
            <div className="flex items-center gap-4">
              <label className="text-xl font-heading font-semibold text-warm-800 min-w-[80px]">
                To:
              </label>
              <select
                value={letterData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                className="flex-1 max-w-xs px-4 py-2 border-b-2 border-warm-300 bg-transparent text-warm-800 font-medium focus:outline-none focus:border-rose-400 transition-colors"
              >
                <option value="">Select recipient...</option>
                <option value="May">May</option>
                <option value="Michael">Michael</option>
              </select>
            </div>

            {/* Open when field */}
            <div className="flex flex-col gap-2">
              <label className="text-xl font-heading font-semibold text-warm-800">
                Open when...
              </label>
              <select
                value={letterData.openWhen}
                onChange={(e) => handleInputChange('openWhen', e.target.value)}
                className="w-full max-w-md px-4 py-2 border-b-2 border-warm-300 bg-transparent text-warm-800 font-medium focus:outline-none focus:border-rose-400 transition-colors"
              >
                <option value="">Select an option...</option>
                {OPEN_WHEN_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value="custom">Custom...</option>
              </select>

              {/* Custom open when input */}
              {letterData.openWhen === 'custom' && (
                <input
                  type="text"
                  value={letterData.customOpenWhen}
                  onChange={(e) => handleInputChange('customOpenWhen', e.target.value)}
                  placeholder="Write your own..."
                  className="w-full max-w-md px-4 py-2 border-b-2 border-warm-300 bg-transparent text-warm-800 font-medium focus:outline-none focus:border-rose-400 transition-colors placeholder:text-warm-400"
                />
              )}
            </div>

            {/* Horizontal line separator */}
            <div className="border-t border-gray-200 pt-4" />

            {/* Letter body */}
            <div className="flex-1">
              <textarea
                value={letterData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your letter here..."
                className="w-full h-[40vh] px-2 py-2 bg-transparent text-warm-800 font-medium resize-none focus:outline-none placeholder:text-warm-400 leading-relaxed"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(255, 145, 175, 0.1) 31px, rgba(255, 145, 175, 0.1) 32px)',
                  backgroundPosition: '0 0',
                  lineHeight: '32px',
                }}
              />
            </div>

            {/* Save button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveLetter}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-coral-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Save Letter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const michaelLetters = savedLetters.filter(l => l.to === 'Michael');
  const mayLetters = savedLetters.filter(l => l.to === 'May');

  // Mailbox contents view
  if (viewingMailbox) {
    const letters = viewingMailbox === 'Michael' ? michaelLetters : mayLetters;
    return (
      <div className="min-h-screen bg-sky-200 relative overflow-hidden p-4">
        {/* Back button */}
        <button
          onClick={() => setViewingMailbox(null)}
          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-warm-700 font-medium hover:bg-white transition-colors"
        >
          Back
        </button>

        {/* Title nameplate */}
        <div className="flex justify-center pt-16 pb-8">
          <div className="bg-[#FFF8E7] border border-[#DEB887] rounded-lg shadow-md px-8 py-4 text-center">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-amber-900">
              {viewingMailbox}'s Mailbox
            </h1>
            <p className="text-amber-800/70 mt-1">{letters.length} letter{letters.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Letters grid */}
        {letters.length === 0 ? (
          <div className="flex items-center justify-center mt-20">
            <p className="text-amber-800/60 text-lg font-medium">No letters yet</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4">
            {letters.map((letter) => (
              <div
                key={letter.id}
                className="cursor-pointer transition-transform duration-200 hover:scale-110 flex flex-col items-center"
                onClick={() => handleReadLetter(letter)}
              >
                {/* Envelope */}
                <svg width="100" height="80" viewBox="0 0 100 80">
                  <rect x="5" y="15" width="90" height="60" rx="3" fill="#FFF8DC" stroke="#DEB887" strokeWidth="1.5" />
                  <path d="M5 15 L50 45 L95 15 Z" fill="#FFFEF0" stroke="#DEB887" strokeWidth="1.5" />
                  <circle cx="50" cy="35" r="10" fill="#DC143C" />
                  <circle cx="50" cy="35" r="8" fill="#B22222" />
                  <path d="M50 32 C48 30, 45 32, 46 35 L50 39 L54 35 C55 32, 52 30, 50 32" fill="#FFB6C1" />
                </svg>
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded shadow-md text-center mt-1 max-w-[200px]">
                  <p className="text-warm-600 text-sm text-wrap">Open when {letter.openWhen}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-200 relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-warm-700 font-medium hover:bg-white transition-colors"
      >
        Back to Room
      </button>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-amber-900 drop-shadow-sm">
          Love Letters
        </h1>
      </div>

      {/* Mailboxes area */}
      <div className="flex items-start justify-center gap-8 md:gap-16 pt-24 px-4 h-[calc(100vh)] relative z-10">
        {/* Michael's Mailbox */}
        <div
          className={`cursor-pointer transition-transform duration-300 flex flex-col items-center flex-1 max-w-[45%] ${hoveredItem === 'mailbox-michael' ? 'scale-[1.03]' : ''}`}
          onClick={() => setViewingMailbox('Michael')}
          onMouseEnter={() => setHoveredItem('mailbox-michael')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <svg className="w-full" style={{ height: '100%' }} viewBox="0 0 160 500" preserveAspectRatio="xMidYMin meet">
            {/* Post */}
            <rect x="60" y="120" width="20" height="380" fill="#8B7355" />
            {/* Mailbox body */}
            <rect x="10" y="40" width="120" height="80" rx="8" fill="#4A90D9" stroke="#3A70B0" strokeWidth="2" />
            {/* Rounded top */}
            <path d="M10 60 Q10 20 70 20 Q130 20 130 60" fill="#4A90D9" stroke="#3A70B0" strokeWidth="2" />
            {/* Mail slot */}
            <rect x="35" y="70" width="70" height="6" rx="3" fill="#2A5A8A" />
            {/* Name */}
            <text x="70" y="100" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="serif">Michael</text>
            {/* Flag - up if letters exist */}
            {michaelLetters.length > 0 ? (
              <g>
                <rect x="130" y="30" width="4" height="40" fill="#8B7355" />
                <polygon points="134,30 134,50 155,40" fill="#DC143C" />
              </g>
            ) : (
              <g>
                <rect x="130" y="60" width="4" height="40" fill="#8B7355" />
                <polygon points="134,80 134,100 155,90" fill="#888" />
              </g>
            )}
            {/* Letter count badge */}
            {michaelLetters.length > 0 && (
              <g>
                <circle cx="110" cy="50" r="14" fill="#DC143C" />
                <text x="110" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{michaelLetters.length}</text>
              </g>
            )}
          </svg>
        </div>

        {/* May's Mailbox */}
        <div
          className={`cursor-pointer transition-transform duration-300 flex flex-col items-center flex-1 max-w-[45%] ${hoveredItem === 'mailbox-may' ? 'scale-[1.03]' : ''}`}
          onClick={() => setViewingMailbox('May')}
          onMouseEnter={() => setHoveredItem('mailbox-may')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <svg className="w-full" style={{ height: '100%' }} viewBox="0 0 160 500" preserveAspectRatio="xMidYMin meet">
            {/* Post */}
            <rect x="60" y="120" width="20" height="380" fill="#8B7355" />
            {/* Mailbox body */}
            <rect x="10" y="40" width="120" height="80" rx="8" fill="#E8739A" stroke="#C45A7E" strokeWidth="2" />
            {/* Rounded top */}
            <path d="M10 60 Q10 20 70 20 Q130 20 130 60" fill="#E8739A" stroke="#C45A7E" strokeWidth="2" />
            {/* Mail slot */}
            <rect x="35" y="70" width="70" height="6" rx="3" fill="#B05070" />
            {/* Name */}
            <text x="70" y="100" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="serif">May</text>
            {/* Flag - up if letters exist */}
            {mayLetters.length > 0 ? (
              <g>
                <rect x="130" y="30" width="4" height="40" fill="#8B7355" />
                <polygon points="134,30 134,50 155,40" fill="#DC143C" />
              </g>
            ) : (
              <g>
                <rect x="130" y="60" width="4" height="40" fill="#8B7355" />
                <polygon points="134,80 134,100 155,90" fill="#888" />
              </g>
            )}
            {/* Letter count badge */}
            {mayLetters.length > 0 && (
              <g>
                <circle cx="110" cy="50" r="14" fill="#DC143C" />
                <text x="110" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{mayLetters.length}</text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Writing station - tan box on the right */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10">
        {/* Tan box/desk */}
        <div className="bg-[#D2B48C] rounded-lg shadow-xl p-6 md:p-8 border-4 border-[#8B7355]">
          {/* Paper and pencil - interactive */}
          <div
            className={`relative cursor-pointer transition-transform duration-300 ${hoveredItem === 'write' ? 'scale-105' : ''}`}
            onClick={handleWriteLetter}
            onMouseEnter={() => setHoveredItem('write')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* White paper */}
            <svg
              className="w-32 h-40 md:w-40 md:h-48"
              viewBox="0 0 120 150"
            >
              {/* Paper shadow */}
              <rect x="8" y="8" width="105" height="135" fill="#A0A0A0" opacity="0.3" rx="2" />

              {/* Main paper */}
              <rect x="5" y="5" width="105" height="135" fill="#FFFEF9" rx="2" />
              <rect x="5" y="5" width="105" height="135" fill="none" stroke="#E8E8E8" strokeWidth="1" rx="2" />

              {/* Paper lines */}
              <line x1="15" y1="30" x2="100" y2="30" stroke="#E0E0E0" strokeWidth="1" />
              <line x1="15" y1="45" x2="100" y2="45" stroke="#E0E0E0" strokeWidth="1" />
              <line x1="15" y1="60" x2="100" y2="60" stroke="#E0E0E0" strokeWidth="1" />
              <line x1="15" y1="75" x2="100" y2="75" stroke="#E0E0E0" strokeWidth="1" />
              <line x1="15" y1="90" x2="100" y2="90" stroke="#E0E0E0" strokeWidth="1" />
              <line x1="15" y1="105" x2="100" y2="105" stroke="#E0E0E0" strokeWidth="1" />
              <line x1="15" y1="120" x2="100" y2="120" stroke="#E0E0E0" strokeWidth="1" />

              {/* Red margin line */}
              <line x1="25" y1="10" x2="25" y2="135" stroke="#FFB6C1" strokeWidth="1" />

              {/* Pencil */}
              <g transform="translate(70, 85) rotate(35)">
                {/* Pencil body */}
                <rect x="0" y="0" width="60" height="10" fill="#FFD93D" />
                <rect x="0" y="0" width="60" height="3" fill="#FFF176" />

                {/* Metal band */}
                <rect x="55" y="0" width="8" height="10" fill="#B8B8B8" />
                <rect x="55" y="2" width="8" height="2" fill="#D4D4D4" />
                <rect x="55" y="6" width="8" height="2" fill="#D4D4D4" />

                {/* Eraser */}
                <rect x="63" y="1" width="10" height="8" fill="#FFB6C1" rx="1" />

                {/* Pencil tip */}
                <polygon points="0,0 0,10 -12,5" fill="#F5DEB3" />
                <polygon points="-8,3 -8,7 -12,5" fill="#4A4A4A" />
              </g>
            </svg>

            {/* Hover tooltip */}
            {hoveredItem === 'write' && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-fade-in whitespace-nowrap">
                <p className="text-warm-700 font-medium text-sm md:text-base">Write Letter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grass */}
      <svg className="absolute bottom-0 left-0 w-full z-0" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '480px' }}>
        {/* Back layer - darker grass */}
        <path d="M0 120 L0 75 Q30 60 60 72 Q90 58 120 70 Q150 55 180 68 Q210 60 240 72 Q270 56 300 69 Q330 58 360 71 Q390 55 420 68 Q450 60 480 72 Q510 56 540 69 Q570 58 600 71 Q630 55 660 68 Q690 60 720 72 Q750 56 780 69 Q810 58 840 71 Q870 55 900 68 Q930 60 960 72 Q990 56 1020 69 Q1050 58 1080 71 Q1110 55 1140 68 Q1170 60 1200 72 L1200 120 Z" fill="#2D8B4E" />
        {/* Front layer - lighter grass */}
        <path d="M0 120 L0 85 Q25 72 50 82 Q75 70 100 80 Q125 68 150 79 Q175 72 200 82 Q225 68 250 80 Q275 70 300 81 Q325 68 350 79 Q375 72 400 82 Q425 68 450 80 Q475 70 500 81 Q525 68 550 79 Q575 72 600 82 Q625 68 650 80 Q675 70 700 81 Q725 68 750 79 Q775 72 800 82 Q825 68 850 80 Q875 70 900 81 Q925 68 950 79 Q975 72 1000 82 Q1025 68 1050 80 Q1075 70 1100 81 Q1125 68 1150 79 Q1175 72 1200 82 L1200 120 Z" fill="#3DA862" />
      </svg>
    </div>
  );
}

export default LoveLetters;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

function LandingRoom() {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [framePhoto, setFramePhoto] = useState(null);
  const [showSpotify, setShowSpotify] = useState(false);

  // Fetch random photo from Firestore on mount
  useEffect(() => {
    const fetchRandomPhoto = async () => {
      try {
        const photosSnapshot = await getDocs(collection(db, 'frame-photos'));
        const photos = photosSnapshot.docs.map(doc => doc.data().url);

        if (photos.length > 0) {
          // Pick a random photo
          const randomIndex = Math.floor(Math.random() * photos.length);
          setFramePhoto(photos[randomIndex]);
        }
      } catch (error) {
        console.log('No photos found or error fetching:', error);
      }
    };

    fetchRandomPhoto();
  }, []);

  const handleItemClick = (item) => {
    switch (item) {
      case 'dinosaurs':
        navigate('/home');
        break;
      case 'fireplace':
        navigate('/deep-talk-deck');
        break;
      case 'radio':
        setShowSpotify(true);
        break;
      case 'letter':
        navigate('/love-letters');
        break;
      case 'snowglobe':
        // Future feature - maybe memories/photos
        break;
      case 'yogamat':
        navigate('/workout-class');
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-rose-100 overflow-hidden relative">
      {/* Room Container */}
      <div className="relative w-full h-full max-w-6xl mx-auto">

        {/* Wall */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200 to-amber-100" />

        {/* Wallpaper Pattern - subtle stripes */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(180,120,80,0.3) 40px, rgba(180,120,80,0.3) 42px)'
          }} />
        </div>

        {/* Window - 3x wider, bottom aligned with radio top */}
        <svg
          className="absolute bottom-[11.75rem] md:bottom-[15.75rem] left-1/2 -translate-x-1/2 w-[27rem] h-40 md:w-[36rem] md:h-52"
          viewBox="0 0 600 240"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Window frame background */}
          <rect x="10" y="10" width="580" height="220" rx="8" fill="#8B5A2B" />
          <rect x="20" y="20" width="560" height="200" rx="4" fill="#87CEEB" />

          {/* Clouds spread across - fluffy multi-part clouds */}
          {/* Cloud 1 - low left */}
          <ellipse cx="60" cy="70" rx="20" ry="10" fill="white" opacity="0.7" />
          <ellipse cx="75" cy="65" rx="18" ry="12" fill="white" opacity="0.8" />
          <ellipse cx="90" cy="70" rx="16" ry="9" fill="white" opacity="0.7" />

          {/* Cloud 2 - high */}
          <ellipse cx="200" cy="45" rx="22" ry="11" fill="white" opacity="0.6" />
          <ellipse cx="220" cy="40" rx="28" ry="14" fill="white" opacity="0.7" />
          <ellipse cx="240" cy="45" rx="20" ry="10" fill="white" opacity="0.6" />
          <ellipse cx="225" cy="50" rx="15" ry="8" fill="white" opacity="0.5" />

          {/* Cloud 3 - mid-low */}
          <ellipse cx="380" cy="73" rx="18" ry="9" fill="white" opacity="0.65" />
          <ellipse cx="400" cy="67" rx="25" ry="13" fill="white" opacity="0.7" />
          <ellipse cx="420" cy="71" rx="20" ry="10" fill="white" opacity="0.65" />

          {/* Cloud 4 - high right */}
          <ellipse cx="510" cy="47" rx="16" ry="8" fill="white" opacity="0.6" />
          <ellipse cx="525" cy="43" rx="22" ry="11" fill="white" opacity="0.75" />
          <ellipse cx="545" cy="48" rx="18" ry="9" fill="white" opacity="0.65" />
          <ellipse cx="530" cy="53" rx="12" ry="6" fill="white" opacity="0.5" />

          {/* Pine trees - left side (shorter) */}
          <rect x="76" y="180" width="8" height="40" fill="#654321" />
          <polygon points="72,160 88,160 115,225 45,225" fill="#1E7D1E" />
          <polygon points="80,100 55,180 105,180" fill="#228B22" />
                    
          <rect x="126" y="175" width="8" height="45" fill="#654321" />
          <polygon points="120,152 140,152 172,220 88,220" fill="#1E7D1E" />
          <polygon points="130,90 100,175 160,175" fill="#228B22" />
                    
          <rect x="176" y="180" width="8" height="40" fill="#654321" />
          <polygon points="172,165 188,165 215,225 145,225" fill="#1E7D1E" />
          <polygon points="180,105 155,180 205,180" fill="#228B22" />
                    
          {/* Pine trees - right side (shorter) */}
          <rect x="376" y="178" width="8" height="42" fill="#654321" />
          <polygon points="370,156 390,156 422,223 338,223" fill="#1E7D1E" />
          <polygon points="380,95 350,178 410,178" fill="#228B22" />
                    
          <rect x="476" y="175" width="8" height="45" fill="#654321" />
          <polygon points="468,147 492,147 530,220 430,220" fill="#1E7D1E" />
          <polygon points="480,85 445,175 515,175" fill="#228B22" />
                    
          <rect x="526" y="180" width="8" height="40" fill="#654321" />
          <polygon points="522,160 538,160 565,225 495,225" fill="#1E7D1E" />
          <polygon points="530,100 505,180 555,180" fill="#228B22" />
                    
          {/* Snowflakes falling */}
          <circle cx="50" cy="120" r="2.25" fill="white" opacity="0.7" />
          <circle cx="90" cy="85" r="3" fill="white" opacity="0.8" />
          <circle cx="120" cy="175" r="2.25" fill="white" opacity="0.6" />
          <circle cx="170" cy="60" r="3" fill="white" opacity="0.75" />
          <circle cx="200" cy="180" r="2.25" fill="white" opacity="0.7" />
          <circle cx="240" cy="130" r="3" fill="white" opacity="0.8" />
          <circle cx="280" cy="100" r="3" fill="white" opacity="0.8" />
          <circle cx="320" cy="55" r="2.25" fill="white" opacity="0.65" />
          <circle cx="350" cy="190" r="2.25" fill="white" opacity="0.7" />
          <circle cx="390" cy="140" r="3" fill="white" opacity="0.75" />
          <circle cx="420" cy="80" r="2.25" fill="white" opacity="0.7" />
          <circle cx="450" cy="70" r="3" fill="white" opacity="0.8" />
          <circle cx="480" cy="165" r="2.25" fill="white" opacity="0.65" />
          <circle cx="520" cy="145" r="2.25" fill="white" opacity="0.7" />
          <circle cx="550" cy="95" r="3" fill="white" opacity="0.8" />
          <circle cx="570" cy="175" r="2.25" fill="white" opacity="0.7" />

          {/* Window panes - on top layer */}
          <line x1="150" y1="20" x2="150" y2="220" stroke="#8B5A2B" strokeWidth="6" />
          <line x1="300" y1="20" x2="300" y2="220" stroke="#8B5A2B" strokeWidth="6" />
          <line x1="450" y1="20" x2="450" y2="220" stroke="#8B5A2B" strokeWidth="6" />
          <line x1="20" y1="120" x2="580" y2="120" stroke="#8B5A2B" strokeWidth="6" />

          {/* Window sill - on top */}
          <rect x="5" y="220" width="590" height="20" rx="2" fill="#6B4423" />

          {/* Plants on sill */}
          <ellipse cx="100" cy="218" rx="12" ry="8" fill="#8B4513" />
          <ellipse cx="100" cy="210" rx="8" ry="10" fill="#228B22" />
          <ellipse cx="95" cy="207" rx="5" ry="7" fill="#32CD32" />

          <ellipse cx="500" cy="218" rx="14" ry="8" fill="#8B4513" />
          <ellipse cx="500" cy="209" rx="10" ry="12" fill="#228B22" />
          <ellipse cx="505" cy="205" rx="6" ry="8" fill="#32CD32" />
        </svg>

        {/* Bookshelf - Large floor-standing */}
        <svg
          className="absolute bottom-[6.25rem] right-[0.5rem] md:right-[3rem] w-28 h-56 md:w-40 md:h-80 z-10"
          viewBox="0 0 120 240"
        >
          {/* Shelf frame */}
          <rect x="5" y="5" width="110" height="235" rx="3" fill="#6B4423" />
          <rect x="10" y="10" width="100" height="225" fill="#8B5A2B" />

          {/* Shelves */}
          <rect x="10" y="55" width="100" height="6" fill="#5D4037" />
          <rect x="10" y="105" width="100" height="6" fill="#5D4037" />
          <rect x="10" y="155" width="100" height="6" fill="#5D4037" />
          <rect x="10" y="205" width="100" height="6" fill="#5D4037" />

          {/* Top shelf - Books */}
          <rect x="15" y="15" width="14" height="38" fill="#DC143C" rx="1" />
          <rect x="31" y="18" width="12" height="35" fill="#4169E1" rx="1" />
          <rect x="45" y="12" width="16" height="41" fill="#228B22" rx="1" />
          <rect x="63" y="20" width="10" height="33" fill="#FFD700" rx="1" />
          <rect x="75" y="14" width="13" height="39" fill="#8B008B" rx="1" />
          <rect x="90" y="17" width="11" height="36" fill="#CD853F" rx="1" />

          {/* Second shelf - Books + Globe */}
          <rect x="15" y="62" width="12" height="41" fill="#FF6347" rx="1" />
          <rect x="29" y="67" width="14" height="36" fill="#4682B4" rx="1" />
          {/* Globe */}
          <circle cx="58" cy="88" r="12" fill="#5DADE2" />
          <ellipse cx="58" cy="88" rx="12" ry="4" fill="#2E86AB" opacity="0.5" />
          <ellipse cx="58" cy="88" rx="4" ry="12" fill="#2E86AB" opacity="0.3" />
          <rect x="53" y="98" width="10" height="5" fill="#8B4513" />
          <rect x="74" y="65" width="12" height="38" fill="#9370DB" rx="1" />
          <rect x="88" y="68" width="14" height="35" fill="#2E8B57" rx="1" />

          {/* Third shelf - Books */}
          <rect x="15" y="115" width="16" height="38" fill="#B22222" rx="1" />
          <rect x="33" y="118" width="11" height="35" fill="#4682B4" rx="1" />
          <rect x="46" y="112" width="13" height="41" fill="#E74C3C" rx="1" />
          <rect x="61" y="116" width="10" height="37" fill="#8E44AD" rx="1" />
          <rect x="73" y="114" width="14" height="39" fill="#F39C12" rx="1" />
          <rect x="89" y="118" width="12" height="35" fill="#1ABC9C" rx="1" />

          {/* Fourth shelf - Books on left side */}
          <rect x="15" y="162" width="12" height="41" fill="#3498DB" rx="1" />
          <rect x="29" y="165" width="10" height="38" fill="#E67E22" rx="1" />

          {/* Fifth shelf (bottom) - Plant */}
          <ellipse cx="30" cy="225" rx="14" ry="8" fill="#8B4513" />
          <ellipse cx="30" cy="215" rx="10" ry="14" fill="#228B22" />
          <ellipse cx="26" cy="210" rx="6" ry="10" fill="#32CD32" />
          <ellipse cx="35" cy="212" rx="5" ry="8" fill="#27AE60" />

          {/* More books on bottom shelf */}
          <rect x="52" y="212" width="12" height="22" fill="#1ABC9C" rx="1" />
          <rect x="66" y="210" width="14" height="24" fill="#9B59B6" rx="1" />
          <rect x="82" y="214" width="10" height="20" fill="#E74C3C" rx="1" />
          <rect x="94" y="211" width="11" height="23" fill="#3498DB" rx="1" />
        </svg>

        {/* Radio - Interactive (on fourth shelf of bookshelf) */}
        <svg
          className={`absolute bottom-[8.5rem] right-[3.75rem] w-12 h-10 md:w-16 md:h-14 z-20 cursor-pointer transition-transform origin-bottom ${hoveredItem === 'radio' ? 'scale-110' : ''}`}
          viewBox="0 0 50 38"
          onClick={() => handleItemClick('radio')}
          onMouseEnter={() => setHoveredItem('radio')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Radio body - sitting on shelf */}
          <rect x="2" y="6" width="42" height="28" rx="3" fill="#8B4513" />
          <rect x="5" y="9" width="36" height="22" rx="2" fill="#A0522D" />

          {/* Speaker grille */}
          <rect x="8" y="12" width="16" height="15" rx="2" fill="#3E2723" />
          <line x1="11" y1="14" x2="11" y2="25" stroke="#5D4037" strokeWidth="1.5" />
          <line x1="14" y1="14" x2="14" y2="25" stroke="#5D4037" strokeWidth="1.5" />
          <line x1="17" y1="14" x2="17" y2="25" stroke="#5D4037" strokeWidth="1.5" />
          <line x1="20" y1="14" x2="20" y2="25" stroke="#5D4037" strokeWidth="1.5" />

          {/* Dial */}
          <circle cx="32" cy="16" r="5" fill="#DEB887" />
          <circle cx="32" cy="16" r="3" fill="#F5DEB3" />
          <line x1="32" y1="16" x2="32" y2="13" stroke="#8B4513" strokeWidth="1" />

          {/* Knobs */}
          <circle cx="28" cy="27" r="2" fill="#2F1810" />
          <circle cx="36" cy="27" r="2" fill="#2F1810" />

          {/* Antenna */}
          <line x1="38" y1="6" x2="45" y2="0" stroke="#5D4037" strokeWidth="1.5" />
          <circle cx="45" cy="0" r="1.5" fill="#FFD700" />

          {/* Shadow under radio to show it's sitting */}
          <ellipse cx="23" cy="35" rx="18" ry="2" fill="#3E2723" opacity="0.3" />

          {/* Music notes floating when hovered */}
          {hoveredItem === 'radio' && (
            <>
              <text x="46" y="4" fontSize="6" fill="#E91E63" className="animate-pulse">♪</text>
              <text x="48" y="10" fontSize="5" fill="#9C27B0" className="animate-pulse">♫</text>
            </>
          )}
        </svg>

        {/* Love Letter - Interactive */}
        <svg
          className={`absolute bottom-[13rem] right-[2rem] md:right-[5rem] w-12 h-10 md:w-16 md:h-14 z-20 cursor-pointer transition-transform ${hoveredItem === 'letter' ? 'scale-110 rotate-3' : ''}`}
          viewBox="0 0 60 50"
          onClick={() => handleItemClick('letter')}
          onMouseEnter={() => setHoveredItem('letter')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Envelope */}
          <rect x="5" y="10" width="50" height="35" rx="2" fill="#FFF8DC" />
          <rect x="5" y="10" width="50" height="35" rx="2" fill="none" stroke="#DEB887" strokeWidth="2" />

          {/* Envelope flap */}
          <path d="M5 12 L30 28 L55 12" fill="none" stroke="#DEB887" strokeWidth="2" />

          {/* Heart seal */}
          <path d="M30 22 C25 17, 18 22, 22 28 L30 36 L38 28 C42 22, 35 17, 30 22" fill="#DC143C" />

          {/* Shine on heart */}
          <ellipse cx="26" cy="25" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.6" />
        </svg>

        {/* Fireplace */}
        <svg
          className={`absolute bottom-[5.75rem] left-[1rem] md:left-[4rem] w-28 h-48 md:w-36 md:h-60 z-10 cursor-pointer transition-transform ${hoveredItem === 'fireplace' ? 'scale-105' : ''}`}
          viewBox="0 -60 140 220"
          onClick={() => handleItemClick('fireplace')}
          onMouseEnter={() => setHoveredItem('fireplace')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Fireplace frame */}
          <rect x="5" y="20" width="130" height="140" rx="5" fill="#8B4513" />
          <rect x="0" y="10" width="140" height="15" rx="3" fill="#6B4423" />
          <rect x="15" y="35" width="110" height="100" rx="3" fill="#2F1810" />

          {/* Fire */}
          <ellipse cx="70" cy="120" rx="40" ry="15" fill="#FF4500" opacity="0.8">
            <animate attributeName="rx" values="38;42;38" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="70" cy="110" rx="30" ry="25" fill="#FF6347" opacity="0.9">
            <animate attributeName="ry" values="23;27;23" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="70" cy="100" rx="20" ry="30" fill="#FFA500" opacity="0.9">
            <animate attributeName="ry" values="28;32;28" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="70" cy="90" rx="12" ry="25" fill="#FFD700" opacity="0.8">
            <animate attributeName="ry" values="23;27;23" dur="0.35s" repeatCount="indefinite" />
          </ellipse>

          {/* Logs */}
          <ellipse cx="50" cy="130" rx="20" ry="6" fill="#4A3728" transform="rotate(-10 50 130)" />
          <ellipse cx="90" cy="130" rx="20" ry="6" fill="#3E2C1E" transform="rotate(10 90 130)" />

          {/* Mantle decorations */}
          {/* Vase with tulips - 4x larger, 50% wider vase */}
          <ellipse cx="111" cy="-17" rx="12" ry="4" fill="#6B8E9F" /> {/* Vase top */}
          <path d="M99 -17 Q96 3 102 10 L120 10 Q126 3 123 -17" fill="#5D7A8A" /> {/* Vase body */}
          <ellipse cx="111" cy="10" rx="9" ry="3" fill="#4A6670" /> {/* Vase bottom */}
          {/* Stems */}
          <line x1="103" y1="-17" x2="99" y2="-26" stroke="#228B22" strokeWidth="2.5" />
          <line x1="111" y1="-17" x2="111" y2="-36" stroke="#228B22" strokeWidth="2.5" />
          <line x1="119" y1="-17" x2="123" y2="-23" stroke="#228B22" strokeWidth="2.5" />
          {/* Tulip flowers - with petals, bottoms aligned */}
          {/* Pink tulip - bottom at -26 */}
          <ellipse cx="95" cy="-32" rx="2.5" ry="6" fill="#E91E63" transform="rotate(-15 95 -32)" />
          <ellipse cx="99" cy="-32.5" rx="2.5" ry="6.5" fill="#EC407A" />
          <ellipse cx="103" cy="-32" rx="2.5" ry="6" fill="#E91E63" transform="rotate(15 103 -32)" />
          <ellipse cx="97" cy="-31" rx="2" ry="5" fill="#F48FB1" transform="rotate(-8 97 -31)" />
          <ellipse cx="101" cy="-31" rx="2" ry="5" fill="#F48FB1" transform="rotate(8 101 -31)" />

          {/* Yellow tulip - bottom at -36 */}
          <ellipse cx="107" cy="-42" rx="2.5" ry="6" fill="#FBC02D" transform="rotate(-15 107 -42)" />
          <ellipse cx="111" cy="-42.5" rx="2.5" ry="6.5" fill="#F9A825" />
          <ellipse cx="115" cy="-42" rx="2.5" ry="6" fill="#FBC02D" transform="rotate(15 115 -42)" />
          <ellipse cx="109" cy="-41" rx="2" ry="5" fill="#FFD54F" transform="rotate(-8 109 -41)" />
          <ellipse cx="113" cy="-41" rx="2" ry="5" fill="#FFD54F" transform="rotate(8 113 -41)" />

          {/* Orange tulip - bottom at -23 */}
          <ellipse cx="119" cy="-29" rx="2.5" ry="6" fill="#FF5722" transform="rotate(-15 119 -29)" />
          <ellipse cx="123" cy="-29.5" rx="2.5" ry="6.5" fill="#FF7043" />
          <ellipse cx="127" cy="-29" rx="2.5" ry="6" fill="#FF5722" transform="rotate(15 127 -29)" />
          <ellipse cx="121" cy="-28" rx="2" ry="5" fill="#FFAB91" transform="rotate(-8 121 -28)" />
          <ellipse cx="125" cy="-28" rx="2" ry="5" fill="#FFAB91" transform="rotate(8 125 -28)" />
        </svg>

        {/* Gold Picture Frame above fireplace */}
        <svg
          className="absolute bottom-[18.25rem] md:bottom-[22.25rem] left-[2rem] md:left-[5rem] w-20 h-16 md:w-28 md:h-20 z-5"
          viewBox="0 0 100 80"
        >
          {/* Outer gold frame */}
          <rect x="2" y="2" width="96" height="76" rx="2" fill="#B8860B" />
          <rect x="4" y="4" width="92" height="72" rx="2" fill="#DAA520" />

          {/* Frame beveled edges */}
          <rect x="6" y="6" width="88" height="68" rx="1" fill="#CD853F" />
          <rect x="8" y="8" width="84" height="64" rx="1" fill="#DAA520" />

          {/* Inner gold trim */}
          <rect x="10" y="10" width="80" height="60" rx="1" fill="#B8860B" />
          <rect x="12" y="12" width="76" height="56" rx="1" fill="#F4E4BA" />

          {/* Picture inside - photo from database or fallback sunset */}
          {framePhoto ? (
            <image
              x="14"
              y="14"
              width="72"
              height="52"
              href={framePhoto}
              preserveAspectRatio="xMidYMid slice"
              clipPath="inset(0)"
            />
          ) : (
            <>
              {/* Fallback sunset landscape */}
              <rect x="14" y="14" width="72" height="52" fill="#FFB347" />
              <rect x="14" y="14" width="72" height="26" fill="#FF6B6B" opacity="0.7" />
              <rect x="14" y="14" width="72" height="18" fill="#FF8C42" opacity="0.6" />
              <circle cx="65" cy="28" r="8" fill="#FFD700" />
              <circle cx="65" cy="28" r="6" fill="#FFF8DC" opacity="0.8" />
              <polygon points="14,50 35,30 56,50" fill="#8B7355" />
              <polygon points="40,50 60,32 80,50 86,50" fill="#6B5344" />
              <rect x="14" y="50" width="72" height="16" fill="#4A6741" />
            </>
          )}

          {/* Frame corner decorations */}
          <circle cx="12" cy="12" r="3" fill="#FFD700" />
          <circle cx="88" cy="12" r="3" fill="#FFD700" />
          <circle cx="12" cy="68" r="3" fill="#FFD700" />
          <circle cx="88" cy="68" r="3" fill="#FFD700" />

          {/* Frame shine */}
          <rect x="6" y="6" width="20" height="3" fill="white" opacity="0.3" rx="1" />
        </svg>

        {/* Snowglobe */}
        <svg
          className="absolute bottom-[13.25rem] md:bottom-[15.05rem] left-[2.5rem] md:left-[4.5rem] w-10 h-12 md:w-12 md:h-14 z-20"
          viewBox="0 0 50 60"
        >
          {/* Base */}
          <rect x="13" y="46" width="24" height="6" fill="#5e9ee7" rx="1" />

          {/* Glass globe */}
          <circle cx="25" cy="28" r="20" fill="#E8F4F8" opacity="0.9" />
          <circle cx="25" cy="28" r="19" fill="#D4EBF2" opacity="0.6" />

          {/* Fushimi Inari Torii Gates inside */}
          {/* Back gate */}
          <rect x="17" y="26" width="2" height="14" fill="#D63031" />
          <rect x="31" y="26" width="2" height="14" fill="#D63031" />
          <rect x="15" y="24" width="20" height="3" fill="#D63031" />
          <rect x="16" y="28" width="18" height="2" fill="#D63031" />

          {/* Front gate (slightly larger, more forward) */}
          <rect x="15" y="30" width="2.5" height="12" fill="#E74C3C" />
          <rect x="32.5" y="30" width="2.5" height="12" fill="#E74C3C" />
          <rect x="13" y="28" width="24" height="3" fill="#E74C3C" />
          <rect x="14" y="32" width="22" height="2" fill="#E74C3C" />

          {/* Snow at bottom */}
          <ellipse cx="25" cy="42" rx="16" ry="5" fill="white" />

          {/* Snow particles */}
          <circle cx="20" cy="20" r="1" fill="white" opacity="0.8" />
          <circle cx="33" cy="30" r="0.8" fill="white" opacity="0.7" />
          <circle cx="15" cy="35" r="0.6" fill="white" opacity="0.8" />
          <circle cx="29" cy="18" r="0.7" fill="white" opacity="0.6" />
          <circle cx="23" cy="38" r="0.8" fill="white" opacity="0.7" />

          {/* Glass shine */}
          <ellipse cx="17" cy="18" rx="4" ry="6" fill="white" opacity="0.3" transform="rotate(-20 17 18)" />
        </svg>

        {/* Yoga Mat - Interactive */}
        <svg
          className={`absolute bottom-[0rem] md:bottom-[1rem] left-[2rem] md:left-[6rem] w-32 h-16 md:w-48 md:h-24 z-15 cursor-pointer transition-transform ${hoveredItem === 'yogamat' ? 'scale-110' : ''}`}
          viewBox="0 0 120 50"
          onClick={() => handleItemClick('yogamat')}
          onMouseEnter={() => setHoveredItem('yogamat')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Mat unrolled part */}
          <rect x="25" y="20" width="85" height="22" rx="2" fill="#9B7BB8" />
          <rect x="27" y="22" width="81" height="18" fill="#B794C0" />

          {/* Mat texture lines */}
          <line x1="35" y1="22" x2="35" y2="40" stroke="#9B7BB8" strokeWidth="1" opacity="0.5" />
          <line x1="50" y1="22" x2="50" y2="40" stroke="#9B7BB8" strokeWidth="1" opacity="0.5" />
          <line x1="65" y1="22" x2="65" y2="40" stroke="#9B7BB8" strokeWidth="1" opacity="0.5" />
          <line x1="80" y1="22" x2="80" y2="40" stroke="#9B7BB8" strokeWidth="1" opacity="0.5" />
          <line x1="95" y1="22" x2="95" y2="40" stroke="#9B7BB8" strokeWidth="1" opacity="0.5" />

          {/* Small dumbbell on mat */}
          <rect x="55" y="28" width="20" height="4" rx="2" fill="#AB47BC" />
          <rect x="52" y="26" width="6" height="8" rx="1" fill="#7B1FA2" />
          <rect x="72" y="26" width="6" height="8" rx="1" fill="#7B1FA2" />
        </svg>

        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[10rem] z-0 bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500">
          {/* Wood grain pattern */}
          <div className="h-full w-full opacity-30" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(80,40,20,0.4) 60px, rgba(80,40,20,0.4) 62px)'
          }} />
        </div>

        {/* Square Rug with Tassels - 1.5x wider, tassels on left/right */}
        <svg
          className="absolute bottom-[1.125rem] md:bottom-[1.375rem] left-1/2 -translate-x-1/2 w-84 h-28 md:w-[27rem] md:h-36 z-5"
          viewBox="0 0 300 100"
        >
          {/* Rug shadow */}
          <rect x="18" y="12" width="264" height="80" rx="2" fill="#3E2723" opacity="0.3" />

          {/* Main rug body */}
          <rect x="15" y="8" width="270" height="76" rx="2" fill="#8B4513" />

          {/* Rug border */}
          <rect x="20" y="13" width="260" height="66" rx="1" fill="#A0522D" />

          {/* Inner pattern area */}
          <rect x="28" y="20" width="244" height="52" fill="#CD853F" />

          {/* Decorative pattern - diamond center */}
          <polygon points="150,26 190,46 150,66 110,46" fill="#DEB887" />
          <polygon points="150,32 175,46 150,60 125,46" fill="#E8D4B8" />

          {/* Corner decorations */}
          <rect x="35" y="24" width="25" height="14" fill="#DEB887" />
          <rect x="240" y="24" width="25" height="14" fill="#DEB887" />
          <rect x="35" y="54" width="25" height="14" fill="#DEB887" />
          <rect x="240" y="54" width="25" height="14" fill="#DEB887" />

          {/* Border lines */}
          <rect x="28" y="20" width="244" height="3" fill="#8B4513" opacity="0.5" />
          <rect x="28" y="69" width="244" height="3" fill="#8B4513" opacity="0.5" />

          {/* Left tassels - pointing left */}
          <line x1="15" y1="15" x2="3" y2="15" stroke="#A0522D" strokeWidth="2" />
          <line x1="15" y1="23" x2="5" y2="23" stroke="#A0522D" strokeWidth="2" />
          <line x1="15" y1="31" x2="2" y2="31" stroke="#A0522D" strokeWidth="2" />
          <line x1="15" y1="39" x2="6" y2="39" stroke="#A0522D" strokeWidth="2" />
          <line x1="15" y1="47" x2="3" y2="47" stroke="#A0522D" strokeWidth="2" />
          <line x1="15" y1="55" x2="5" y2="55" stroke="#A0522D" strokeWidth="2" />
          <line x1="15" y1="63" x2="2" y2="63" stroke="#A0522D" strokeWidth="2" />
          <line x1="15" y1="71" x2="6" y2="71" stroke="#A0522D" strokeWidth="2" />
          <line x1="15" y1="79" x2="4" y2="79" stroke="#A0522D" strokeWidth="2" />

          {/* Right tassels - pointing right */}
          <line x1="285" y1="15" x2="297" y2="15" stroke="#A0522D" strokeWidth="2" />
          <line x1="285" y1="23" x2="295" y2="23" stroke="#A0522D" strokeWidth="2" />
          <line x1="285" y1="31" x2="298" y2="31" stroke="#A0522D" strokeWidth="2" />
          <line x1="285" y1="39" x2="294" y2="39" stroke="#A0522D" strokeWidth="2" />
          <line x1="285" y1="47" x2="297" y2="47" stroke="#A0522D" strokeWidth="2" />
          <line x1="285" y1="55" x2="295" y2="55" stroke="#A0522D" strokeWidth="2" />
          <line x1="285" y1="63" x2="298" y2="63" stroke="#A0522D" strokeWidth="2" />
          <line x1="285" y1="71" x2="294" y2="71" stroke="#A0522D" strokeWidth="2" />
          <line x1="285" y1="79" x2="296" y2="79" stroke="#A0522D" strokeWidth="2" />
        </svg>

        {/* Couch - front-facing perspective */}
        <svg
          className="absolute bottom-[3.5rem] left-1/2 -translate-x-1/2 w-64 h-28 md:w-80 md:h-36 z-20 drop-shadow-lg"
          viewBox="0 0 300 120"
        >
          {/* Shadow under couch */}
          <rect x="15" y="110" width="270" height="8" rx="4" fill="#4A3728" opacity="0.3" />

          {/* Couch legs */}
          <rect x="25" y="100" width="10" height="14" rx="2" fill="#5D4037" />
          <rect x="265" y="100" width="10" height="14" rx="2" fill="#5D4037" />

          {/* Couch base/frame */}
          <rect x="10" y="55" width="280" height="50" rx="4" fill="#B8926A" />

          {/* Left armrest */}
          <rect x="5" y="20" width="30" height="85" rx="4" fill="#C9A076" />
          <rect x="8" y="23" width="24" height="30" rx="3" fill="#D4A574" />

          {/* Right armrest */}
          <rect x="265" y="20" width="30" height="85" rx="4" fill="#C9A076" />
          <rect x="268" y="23" width="24" height="30" rx="3" fill="#D4A574" />

          {/* Couch back */}
          <rect x="30" y="5" width="240" height="55" rx="4" fill="#C9A076" />

          {/* Back cushions */}
          <rect x="40" y="10" width="105" height="45" rx="5" fill="#DEB887" />
          <rect x="155" y="10" width="105" height="45" rx="5" fill="#DEB887" />

          {/* Back cushion details */}
          <line x1="92" y1="15" x2="92" y2="50" stroke="#D4B882" strokeWidth="2" opacity="0.5" />
          <line x1="207" y1="15" x2="207" y2="50" stroke="#D4B882" strokeWidth="2" opacity="0.5" />

          {/* Seat cushions */}
          <rect x="38" y="58" width="108" height="40" rx="4" fill="#E8D4B8" />
          <rect x="154" y="58" width="108" height="40" rx="4" fill="#E8D4B8" />

          {/* Seat cushion lines */}
          <line x1="92" y1="62" x2="92" y2="94" stroke="#DCC9A8" strokeWidth="2" opacity="0.5" />
          <line x1="208" y1="62" x2="208" y2="94" stroke="#DCC9A8" strokeWidth="2" opacity="0.5" />

          {/* Heart cushions on seat */}
          <g transform="translate(45, 22) rotate(-10)">
            <path d="M25 13 C18 0, 0 0, 0 15 C0 28, 25 45, 25 45 C25 45, 50 28, 50 15 C50 0, 32 0, 25 13" fill="#EAA221" />
            <path d="M20 16 C16 10, 8 11, 11 18" fill="#F5C04A" opacity="0.5" />
          </g>
          <g transform="translate(190, 18) rotate(10)">
            <path d="M25 13 C18 0, 0 0, 0 15 C0 28, 25 45, 25 45 C25 45, 50 28, 50 15 C50 0, 32 0, 25 13" fill="#E07850" />
            <path d="M20 16 C16 10, 8 11, 11 18" fill="#F0937D" opacity="0.5" />
          </g>
        </svg>

        {/* Dinosaurs - Interactive element for games */}
        <div
          className={`absolute bottom-[2.5rem] md:bottom-[3rem] left-1/2 -translate-x-1/2 z-20 cursor-pointer transition-transform duration-300 ${hoveredItem === 'dinosaurs' ? 'scale-110' : ''}`}
          onClick={() => handleItemClick('dinosaurs')}
          onMouseEnter={() => setHoveredItem('dinosaurs')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Green Stuffed Triceratops */}
          <svg
            className="absolute -left-[3.5rem] md:-left-[5rem] bottom-0 w-12 h-9 md:w-16 md:h-12"
            viewBox="0 0 80 55"
          >
            {/* Shadow */}
            <ellipse cx="40" cy="52" rx="25" ry="4" fill="#654321" opacity="0.3" />

            {/* Body */}
            <ellipse cx="40" cy="38" rx="22" ry="14" fill="#4A7C59" />

            {/* Back legs */}
            <ellipse cx="52" cy="48" rx="6" ry="4" fill="#3D6B4A" />
            <ellipse cx="30" cy="48" rx="6" ry="4" fill="#3D6B4A" />

            {/* Tail */}
            <path d="M60 38 Q72 36 75 40 Q72 44 62 42" fill="#4A7C59" />

            {/* Frill/Shield - behind the neck */}
            <path d="M32 26 Q34 22 32 18 Q29 14 25 14 Q21 14 19 18 Q17 22 19 26" fill="#4A7C59" />
            {/* Frill scallop bumps */}
            <circle cx="32" cy="19" r="2" fill="#4A7C59" />
            <circle cx="29" cy="15" r="2" fill="#4A7C59" />
            <circle cx="24" cy="14" r="2" fill="#4A7C59" />
            <circle cx="20" cy="16" r="2" fill="#4A7C59" />
            <circle cx="18" cy="21" r="2" fill="#4A7C59" />
            {/* Frill spots */}
            <circle cx="28" cy="19" r="1" fill="#3D6B4A" />
            <circle cx="24" cy="18" r="1" fill="#3D6B4A" />
            <circle cx="21" cy="20" r="1" fill="#3D6B4A" />

            {/* Head */}
            <ellipse cx="18" cy="30" rx="14" ry="10" fill="#5A8F6A" />

            {/* Horns */}
            <path d="M8 24 L2 16 L6 22" fill="#F5DEB3" />
            <path d="M18 22 L18 10 L22 20" fill="#F5DEB3" />
            <path d="M26 26 L32 18 L28 24" fill="#F5DEB3" />

            {/* Beak */}
            <path d="M4 32 L2 30 L4 28 Q6 30 4 32" fill="#DEB887" />

            {/* Eye */}
            <circle cx="14" cy="28" r="3" fill="white" />
            <circle cx="13" cy="28" r="1.5" fill="#2F1810" />

            {/* Cute blush */}
            <ellipse cx="10" cy="32" rx="2" ry="1" fill="#FFB6C1" opacity="0.6" />

            {/* Spots on body */}
            <circle cx="35" cy="35" r="3" fill="#5A8F6A" />
            <circle cx="45" cy="40" r="2" fill="#5A8F6A" />
            <circle cx="50" cy="34" r="2.5" fill="#5A8F6A" />
          </svg>

          {/* White Stuffed Triceratops */}
          <svg
            className="absolute left-[0.5rem] md:left-[1rem] bottom-0 w-12 h-9 md:w-16 md:h-12 -scale-x-100"
            viewBox="0 0 80 55"
          >
            {/* Shadow */}
            <ellipse cx="40" cy="52" rx="25" ry="4" fill="#654321" opacity="0.3" />

            {/* Body */}
            <ellipse cx="40" cy="38" rx="22" ry="14" fill="#F5F5F5" />

            {/* Back legs */}
            <ellipse cx="52" cy="48" rx="6" ry="4" fill="#E8E8E8" />
            <ellipse cx="30" cy="48" rx="6" ry="4" fill="#E8E8E8" />

            {/* Tail */}
            <path d="M60 38 Q72 36 75 40 Q72 44 62 42" fill="#F5F5F5" />

            {/* Frill/Shield - behind the neck */}
            <path d="M32 26 Q34 22 32 18 Q29 14 25 14 Q21 14 19 18 Q17 22 19 26" fill="#F0F0F0" />
            {/* Frill scallop bumps */}
            <circle cx="32" cy="19" r="2" fill="#F0F0F0" />
            <circle cx="29" cy="15" r="2" fill="#F0F0F0" />
            <circle cx="24" cy="14" r="2" fill="#F0F0F0" />
            <circle cx="20" cy="16" r="2" fill="#F0F0F0" />
            <circle cx="18" cy="21" r="2" fill="#F0F0F0" />
            {/* Frill spots */}
            <circle cx="28" cy="19" r="1" fill="#E0E0E0" />
            <circle cx="24" cy="18" r="1" fill="#E0E0E0" />
            <circle cx="21" cy="20" r="1" fill="#E0E0E0" />

            {/* Head */}
            <ellipse cx="18" cy="30" rx="14" ry="10" fill="#FAFAFA" />

            {/* Horns */}
            <path d="M8 24 L2 16 L6 22" fill="#FFE4C4" />
            <path d="M18 22 L18 10 L22 20" fill="#FFE4C4" />
            <path d="M26 26 L32 18 L28 24" fill="#FFE4C4" />

            {/* Beak */}
            <path d="M4 32 L2 30 L4 28 Q6 30 4 32" fill="#FFDAB9" />

            {/* Eye */}
            <circle cx="14" cy="28" r="3" fill="white" />
            <circle cx="13" cy="28" r="1.5" fill="#2F1810" />

            {/* Cute blush */}
            <ellipse cx="10" cy="32" rx="2" ry="1" fill="#FFB6C1" opacity="0.6" />

            {/* Spots on body */}
            <circle cx="35" cy="35" r="3" fill="#FAFAFA" />
            <circle cx="45" cy="40" r="2" fill="#FAFAFA" />
            <circle cx="50" cy="34" r="2.5" fill="#FAFAFA" />
          </svg>
        </div>

        {/* Hover tooltips */}
        {hoveredItem === 'dinosaurs' && (
          <div className="absolute bottom-[6rem] md:bottom-[7rem] left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
            <p className="text-warm-700 font-medium text-sm md:text-base">Play together!</p>
          </div>
        )}

        {hoveredItem === 'fireplace' && (
          <div className="absolute bottom-[11rem] md:bottom-[13rem] left-[2rem] md:left-[5rem] z-50 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
            <p className="text-warm-700 font-medium text-sm md:text-base">Start a cozy conversation</p>
          </div>
        )}

        {hoveredItem === 'radio' && !showSpotify && (
          <div className="absolute bottom-[11rem] md:bottom-[16rem] right-[4rem] md:right-[8rem] z-50 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
            <p className="text-warm-700 font-medium text-sm md:text-base">Play some tunes!</p>
          </div>
        )}

        {hoveredItem === 'letter' && (
          <div className="absolute bottom-[14rem] md:bottom-[20rem] right-[1rem] md:right-[3rem] z-50 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
            <p className="text-warm-700 font-medium text-sm md:text-base">Write love letters</p>
          </div>
        )}

        
        {hoveredItem === 'yogamat' && (
          <div className="absolute bottom-[5.75rem] md:bottom-[7rem] left-[7rem] md:left-[11rem] z-50 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
            <p className="text-warm-700 font-medium text-sm md:text-base">Workout together!</p>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute top-[1rem] left-[1rem] md:top-[2rem] md:left-[2rem]">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-amber-900 drop-shadow-sm">
            Couples Connections
          </h1>
          <p className="text-amber-700 text-sm md:text-base mt-1">Your cozy space to connect</p>
        </div>

        {/* Spotify Player Modal */}
        {showSpotify && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative bg-amber-50 rounded-2xl p-4 shadow-2xl max-w-md w-full mx-4">
              {/* Close button */}
              <button
                onClick={() => setShowSpotify(false)}
                className="absolute -top-[0.75rem] -right-[0.75rem] w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-warm-600 hover:text-warm-800 hover:scale-110 transition-transform"
              >
                ✕
              </button>

              {/* Header */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-heading font-bold text-amber-900">Mood Music</h3>
                <p className="text-amber-700 text-sm">Set the vibe for your time together</p>
              </div>

              {/* Spotify Embed */}
              <iframe
                src="https://open.spotify.com/embed/playlist/2XvDjpulPENiqeIjO6LPfR?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              ></iframe>
            </div>
          </div>
        )}

              </div>
    </div>
  );
}

export default LandingRoom;

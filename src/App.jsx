import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoomProvider } from './contexts/RoomContext';
import LandingRoom from './pages/LandingRoom';
import Home from './pages/Home';
import LoveLetters from './pages/LoveLetters';
import WorkoutClass from './pages/WorkoutClass';
import WouldYouRather from './components/Games/WouldYouRather';
import DeepTalkDeck from './components/Games/DeepTalkDeck';
import RelationshipMadLibs from './components/Games/RelationshipMadLibs';
import TypeRacer from './components/Games/TypeRacer';

function App() {
  return (
    <Router>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<LandingRoom />} />
          <Route path="/home" element={<Home />} />
          <Route path="/love-letters" element={<LoveLetters />} />
          <Route path="/games/would-you-rather" element={<WouldYouRather />} />
          <Route path="/games/deep-talk-deck" element={<DeepTalkDeck />} />
          <Route path="/deep-talk-deck" element={<DeepTalkDeck />} />
          <Route path="/games/relationship-mad-libs" element={<RelationshipMadLibs />} />
          <Route path="/games/type-racer" element={<TypeRacer />} />
          <Route path="/workout-class" element={<WorkoutClass />} />
        </Routes>
      </RoomProvider>
    </Router>
  );
}

export default App;

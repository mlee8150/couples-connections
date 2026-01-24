import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoomProvider } from './contexts/RoomContext';
import Home from './pages/Home';
import WouldYouRather from './components/Games/WouldYouRather';
import DeepTalkDeck from './components/Games/DeepTalkDeck';

function App() {
  return (
    <Router>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/would-you-rather" element={<WouldYouRather />} />
          <Route path="/games/deep-talk-deck" element={<DeepTalkDeck />} />
        </Routes>
      </RoomProvider>
    </Router>
  );
}

export default App;

import Hero from './components/Hero';
import InvitationText from './components/InvitationText';
import Info from './components/Info';
import Gallery from './components/Gallery';
import VideoPlayer from './components/VideoPlayer';
import Location from './components/Location';
import DinoGame from './components/DinoGame';

function App() {
  return (
    <div className="app-container">
      <Hero />
      <InvitationText />
      <Info />
      <Gallery />
      <VideoPlayer />
      <DinoGame />
      <Location />
    </div>
  )
}

export default App

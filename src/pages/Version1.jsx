import Hero from '../components/Hero';
import InvitationText from '../components/InvitationText';
import Info from '../components/Info';
import Gallery from '../components/Gallery';
import VideoPlayer from '../components/VideoPlayer';
import Location from '../components/Location';
import DinoGame from '../components/DinoGame';
import MusicPlayer from '../components/MusicPlayer';
import CoupleCards from '../components/CoupleCards';

const Version1 = () => {
    return (
        <div className="app-container">
            <Hero />
            <InvitationText />
            <Info />
            <Gallery />
            <VideoPlayer />
            <DinoGame />
            <CoupleCards />
            <MusicPlayer />
            <Location />
        </div>
    );
};

export default Version1;

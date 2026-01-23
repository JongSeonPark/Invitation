import Hero from '../components/Hero';
import InvitationText from '../components/InvitationText';
import Info from '../components/Info';
import Gallery from '../components/Gallery';
import VideoPlayer from '../components/VideoPlayer';
import Location from '../components/Location';
import MusicPlayer from '../components/MusicPlayer';
import AccountSection from '../components/AccountSection';

const Version1 = () => {
    return (
        <div className="app-container font-classic">
            <Hero />
            <InvitationText />
            <Info />
            <Gallery forceUnlock={true} />
            <VideoPlayer />
            <AccountSection />
            <MusicPlayer />
            <Location />
        </div>
    );
};

export default Version1;

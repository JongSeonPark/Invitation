import { useState } from 'react';
import TitleScreen from '../components/v2/TitleScreen';
import LobbyScreen from '../components/v2/LobbyScreen';

const Version2 = ({ onSwitchToV1 }) => {
    const [scene, setScene] = useState('title'); // 'title', 'lobby'

    const handleStartGame = () => {
        setScene('lobby');
    };

    return (
        <div className="relative w-full h-screen bg-yellow-50 overflow-hidden font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#F97316 2px, transparent 2px)',
                    backgroundSize: '30px 30px'
                }}
            ></div>

            {/* Content Container */}
            <div className="relative w-full h-full">
                {scene === 'title' && <TitleScreen onStart={handleStartGame} onSwitchToV1={onSwitchToV1} />}
                {scene === 'lobby' && <LobbyScreen onSwitchToV1={onSwitchToV1} />}
            </div>
        </div>
    );
};

export default Version2;

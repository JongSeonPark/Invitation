import { useState } from 'react';
import TitleScreen from '../components/v2/TitleScreen';
import LobbyScreen from '../components/v2/LobbyScreen';

const Version2 = ({ onSwitchToV1 }) => {
    const [scene, setScene] = useState('title'); // 'title', 'lobby'
    const [isNewUser, setIsNewUser] = useState(false);

    const handleStartGame = (newUser = false) => {
        setIsNewUser(newUser);
        setScene('lobby');
    };

    return (
        <div className="relative w-full h-screen bg-background overflow-hidden font-body selection:bg-primary/20 selection:text-primary">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-soft-pink/30 rounded-full blur-[80px] animate-bounce delay-500 duration-[5000ms]"></div>

            {/* Content Container */}
            <div className="relative w-full h-full">
                {scene === 'title' && <TitleScreen onStart={handleStartGame} onSwitchToV1={onSwitchToV1} />}
                {scene === 'lobby' && <LobbyScreen onSwitchToV1={onSwitchToV1} isNewUser={isNewUser} />}
            </div>
        </div>
    );
};

export default Version2;

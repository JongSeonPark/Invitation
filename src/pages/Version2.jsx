import { useState } from 'react';
import TitleScreen from '../components/v2/TitleScreen';
import LobbyScreen from '../components/v2/LobbyScreen';

const Version2 = ({ onSwitchToV1 }) => {
    const [scene, setScene] = useState('title'); // 'title', 'lobby'

    const handleStartGame = () => {
        setScene('lobby');
    };

    return (
        <div style={styles.container}>
            {scene === 'title' && <TitleScreen onStart={handleStartGame} />}
            {scene === 'lobby' && <LobbyScreen onSwitchToV1={onSwitchToV1} />}
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
        position: 'relative',
    },
    lobbyPlaceholder: {
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    }
};

export default Version2;

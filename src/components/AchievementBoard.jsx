import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { ACHIEVEMENTS } from '../utils/achievementManager';

const AchievementBoard = () => {
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!currentUser) return;
            try {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUnlockedIds(docSnap.data().achievements || []);
                }
            } catch (error) {
                console.error("Error fetching achievements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [currentUser]);

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;

    const achievementList = Object.values(ACHIEVEMENTS);

    return (
        <div style={styles.container}>
            <h3 style={styles.header}>🎖️ 나의 업적 (MY ACHIEVEMENTS)</h3>
            <div style={styles.grid}>
                {achievementList.map((ach) => {
                    const isUnlocked = unlockedIds.includes(ach.id);
                    return (
                        <div key={ach.id} style={{
                            ...styles.card,
                            ...(isUnlocked ? styles.unlocked : styles.locked)
                        }}>
                            <div style={styles.icon}>
                                {isUnlocked ? '🏆' : '🔒'}
                            </div>
                            <div style={styles.info}>
                                <div style={styles.title}>{ach.title}</div>
                                <div style={styles.desc}>{ach.desc}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '10px',
        color: '#333',
        fontFamily: '"Rajdhani", sans-serif',
    },
    header: {
        textAlign: 'center',
        marginBottom: '15px',
        borderBottom: '2px solid #333',
        paddingBottom: '10px',
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        transition: 'transform 0.2s',
    },
    unlocked: {
        backgroundColor: '#fffbe6', // Light Gold
        border: '2px solid #ffd700',
        boxShadow: '0 2px 5px rgba(255, 215, 0, 0.3)',
    },
    locked: {
        backgroundColor: '#f5f5f5',
        filter: 'grayscale(100%)',
        opacity: 0.7,
    },
    icon: {
        fontSize: '2rem',
        marginRight: '15px',
    },
    info: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: '1rem',
        marginBottom: '3px',
    },
    desc: {
        fontSize: '0.8rem',
        color: '#666',
    }
};

export default AchievementBoard;

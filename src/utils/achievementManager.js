import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { showToast } from '../components/GlobalToast';

export const ACHIEVEMENTS = {
    FIRST_STEP: {
        id: 'FIRST_STEP',
        title: '웨딩 퀘스트 시작',
        desc: '결혼식 앱에 처음 접속했습니다.'
    },
    HIGH_SCORE: {
        id: 'HIGH_SCORE',
        title: '전설의 신랑',
        desc: '신랑 입장 게임에서 30점 이상 획득했습니다.'
    },
    BOUQUET_CATCHER: {
        id: 'BOUQUET_CATCHER',
        title: '나이스 캐치',
        desc: '부케 받기 게임에서 30점 이상 획득했습니다.'
    },
    WEDDING_CRASHER: {
        id: 'WEDDING_CRASHER',
        title: '축하의 손길',
        desc: '로비의 신랑과 신부를 각각 5번씩 터치해보세요!'
    }
};

// Cache to store unlocked achievement IDs in memory
let cachedAchievements = null;
let isFetching = false;
// Session-level Set to prevent duplicate firing while cache is loading
const sessionUnlocked = new Set();

// Initialize cache from localStorage if available (optional optimization)
try {
    const saved = localStorage.getItem('my_achievements');
    if (saved) {
        cachedAchievements = JSON.parse(saved);
        cachedAchievements.forEach(id => sessionUnlocked.add(id));
    }
} catch (e) { console.error(e); }

export const checkAchievement = async (type, value = null) => {
    const user = auth.currentUser;
    if (!user) return; // Must be logged in

    try {
        // 1. Initialize Cache if empty
        if (cachedAchievements === null && !isFetching) {
            isFetching = true;
            try {
                const nickname = localStorage.getItem('wedding_nickname');
                if (!nickname) throw "No nickname found";

                const userRef = doc(db, "users", nickname);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    cachedAchievements = userSnap.data().achievements || [];
                } else {
                    cachedAchievements = [];
                }
                // Sync sessionUnlocked with fresh cache
                cachedAchievements.forEach(id => sessionUnlocked.add(id));
                localStorage.setItem('my_achievements', JSON.stringify(cachedAchievements));
            } catch (err) {
                console.error("Failed to fetch achievements:", err);
            } finally {
                isFetching = false;
            }
        }

        // 2. Define Unlock Logic
        const unlock = async (id) => {
            // Check session Set first (Instant return if already unlocked/fired in this session)
            if (sessionUnlocked.has(id)) return;

            // If cache is not ready yet, we can't be sure if it's new, but we shouldn't spam.
            // Best approach: Add to sessionUnlocked optimistically to prevent duplicate calls.
            sessionUnlocked.add(id);

            // Trigger Popup Event 
            const achievement = ACHIEVEMENTS[id];
            window.dispatchEvent(new CustomEvent('achievement-unlocked', {
                detail: { ...achievement }
            }));

            // If we have a cache, update it
            if (cachedAchievements) {
                cachedAchievements.push(id);
                localStorage.setItem('my_achievements', JSON.stringify(cachedAchievements));
            }

            // Update Firestore in Background
            const nickname = localStorage.getItem('wedding_nickname');
            if (nickname) {
                const userRef = doc(db, "users", nickname);
                // Fire and forget - don't await to avoid blocking game loop if possible
                setDoc(userRef, {
                    achievements: arrayUnion(id)
                }, { merge: true }).catch(err => console.error("Achievement save failed:", err));
            }
        };

        // 3. Logic Mapping
        switch (type) {
            case 'LOGIN':
                await unlock(ACHIEVEMENTS.FIRST_STEP.id);
                break;
                break;
            case 'GAME_SCORE':
                // Check score >= 30 for High Score (Run Game)
                if (value >= 30) await unlock(ACHIEVEMENTS.HIGH_SCORE.id);
                break;
            case 'TOUCH_CHARACTER':
                // Expects value to be { groom: number, bride: number }
                if (value && value.groom >= 5 && value.bride >= 5) {
                    await unlock(ACHIEVEMENTS.WEDDING_CRASHER.id);
                }
                break;
            case 'BOUQUET_GAME_SCORE':
                // Check score >= 30 for Bouquet Catch
                if (value >= 30) await unlock(ACHIEVEMENTS.BOUQUET_CATCHER.id);
                break;
            default:
                break;
        }

    } catch (error) {
        console.error("Error checking achievement:", error);
    }
};

export const resetAchievementCache = () => {
    cachedAchievements = null;
    sessionUnlocked.clear();
    localStorage.removeItem('my_achievements');
};

export default checkAchievement;

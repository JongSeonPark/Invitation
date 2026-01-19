import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { showToast } from '../components/GlobalToast';

const ACHIEVEMENTS = {
    FIRST_STEP: {
        id: 'FIRST_STEP',
        title: '첫 걸음',
        desc: '결혼식 작전에 참여했습니다.'
    },
    RUNNER: {
        id: 'RUNNER',
        title: '준비된 체력',
        desc: '달리기 훈련(미니게임)을 시작했습니다.'
    },
    HIGH_SCORE: {
        id: 'HIGH_SCORE',
        title: '전설의 요원',
        desc: '미니게임 점수 100점을 돌파했습니다!'
    },
    WEDDING_CRASHER: {
        id: 'WEDDING_CRASHER',
        title: '관심 종자?',
        desc: '신랑/신부 캐릭터를 10번 건드렸습니다.'
    },
    DATA_COLLECTOR: {
        id: 'DATA_COLLECTOR',
        title: '데이터 수집가',
        desc: '모든 메뉴를 한 번씩 확인했습니다.'
    }
};

export const checkAchievement = async (type, value = null) => {
    const user = auth.currentUser;
    if (!user) return; // Must be logged in

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const unlocked = userData.achievements || [];

        const unlock = async (id) => {
            if (unlocked.includes(id)) return;

            // Trigger Toast UI
            const achievement = ACHIEVEMENTS[id];
            showToast(`업적 달성: ${achievement.title}`);

            // Update Firestore
            await updateDoc(userRef, {
                achievements: arrayUnion(id)
            });
        };

        // Logic Mapping
        switch (type) {
            case 'LOGIN':
                await unlock(ACHIEVEMENTS.FIRST_STEP.id);
                break;
            case 'GAME_START':
                await unlock(ACHIEVEMENTS.RUNNER.id);
                break;
            case 'GAME_SCORE':
                if (value >= 100) await unlock(ACHIEVEMENTS.HIGH_SCORE.id);
                break;
            case 'TOUCH_CHARACTER':
                // For counters (like 10 clicks), we might need local storage or specific DB field
                // Simple implementation: Client-side counter passed in value? 
                // Let's assume the caller handles the counting for now.
                if (value >= 10) await unlock(ACHIEVEMENTS.WEDDING_CRASHER.id);
                break;
            default:
                break;
        }

    } catch (error) {
        console.error("Error checking achievement:", error);
    }
};

export default checkAchievement;

import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { signInAnonymously, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { checkAchievement } from '../../utils/achievementManager';

const TitleScreen = ({ onStart, onSwitchToV1 }) => {
    const [animate, setAnimate] = useState(false);
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('접속 준비 중...');

    // Check auth status quietly just to keep connection alive, 
    // but we won't auto-skip the input screen based on it.
    useEffect(() => {
        setAnimate(true);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // Optional: If you wanted to pre-fill the name
            // if (currentUser?.displayName) setNickname(currentUser.displayName);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        if (!nickname.trim()) {
            alert("하객명을 입력해주세요! (닉네임)");
            return;
        }

        setLoading(true);

        // Wedding Loading Sequence
        setLoadingText('신랑의 긴장도 체크 중... 위험 수치! 💓');

        const sequence = [
            { text: '신부의 미모 데이터 로딩 중... 용량 초과! ✨', delay: 800 },
            { text: '축의금 계좌 보안 프로토콜 가동... 💸', delay: 1600 },
            { text: `환영합니다, [${nickname}] 하객님! 작전 개시.`, delay: 2400 }
        ];

        sequence.forEach(({ text, delay }) => {
            setTimeout(() => setLoadingText(text), delay);
        });

        // Authenticate & Start
        setTimeout(async () => {
            try {
                let currentUser = auth.currentUser;

                if (!currentUser) {
                    // Sign In Anonymously (Just for connection)
                    const result = await signInAnonymously(auth);
                    currentUser = result.user;
                }

                // 2. Use Nickname as the Primary Key
                const safeNickname = nickname.trim();
                localStorage.setItem('wedding_nickname', safeNickname); // Save globally

                // 3. Check Firestore (users/{nickname})
                const userRef = doc(db, "users", safeNickname);
                const userSnap = await getDoc(userRef);

                let userData = userSnap.exists() ? userSnap.data() : null;
                const isNewUser = !userData;

                if (isNewUser) {
                    // Create New User Data
                    const initialData = {
                        nickname: safeNickname,
                        achievements: [],
                        collection: [],
                        diamonds: 0,
                        storySeen: false,
                        createdAt: new Date(),
                        lastLogin: new Date()
                    };

                    await setDoc(userRef, initialData);

                    // Clear local storage to avoid conflicts
                    localStorage.removeItem('wedding_collection_v2');
                    localStorage.removeItem('my_achievements');

                    userData = initialData; // Local reference
                } else {
                    // Update Last Login
                    await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
                }

                // 4. SYNC DATA (Firestore -> LocalStorage)
                // This ensures "Same Nickname = Same Data" on any device
                if (userData) {
                    // Sync Achievements
                    const ach = userData.achievements || [];
                    localStorage.setItem('my_achievements', JSON.stringify(ach));

                    // Sync Collection
                    const col = userData.collection || [];
                    localStorage.setItem('wedding_collection_v2', JSON.stringify(col));
                    window.dispatchEvent(new Event('collectionUpdated'));

                    // Note: Diamonds are mostly read directly from DB in components, 
                    // or via listeners, so no strict need to sync to LS unless for offline fallback.
                }

                // Achievement: FIRST_STEP
                checkAchievement('LOGIN');

                // Proceed to Game
                onStart(isNewUser);

            } catch (error) {
                console.error("Login Failed", error);
                alert("입장에 실패했습니다. 다시 시도해주세요.");
                setLoading(false);
            }
        }, 3000); // Wait for sequence to finish
    };

    // Simplified pixel loading
    const bgImage = new URL('../../assets/pixel_castle_bg.png', import.meta.url).href;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full font-pixel relative overflow-hidden text-white">

            {/* 16-bit Background Layer */}
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})`, imageRendering: 'pixelated' }}>
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            {/* Pixel Card Container */}
            <div className={`relative z-10 flex flex-col items-center p-8 transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                {/* Retro Border Box */}
                <div className="absolute inset-0 border-4 border-white bg-black/60 shadow-lg" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center text-center w-full max-w-md">

                    {/* Title */}
                    <div className="mb-10 animate-pulse">
                        <p className="text-yellow-400 text-sm tracking-[0.2em] mb-2 uppercase shine">결혼식 퀘스트에 참여하세요</p>
                        <h1 className="text-5xl md:text-7xl text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] leading-tight font-pixel">
                            WEDDING<br />QUEST
                        </h1>
                    </div>

                    {/* Inputs */}
                    <div className="w-full flex flex-col gap-4">
                        {!loading ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="이름 (닉네임)"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="w-full bg-black/50 border-4 border-white text-white p-4 text-center text-xl placeholder:text-gray-500 focus:bg-black/70 focus:outline-none focus:border-yellow-400 transition-colors uppercase font-pixel"
                                    maxLength={8}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                    autoFocus
                                />

                                <button
                                    onClick={handleLogin}
                                    className="w-full bg-blue-600 border-b-4 border-r-4 border-blue-800 text-white p-4 text-xl hover:bg-blue-500 hover:translate-y-1 hover:border-b-0 hover:border-r-0 active:translate-y-2 transition-all group relative overflow-hidden"
                                >
                                    <span className="relative z-10">게임 시작 (START)</span>
                                </button>
                            </>
                        ) : (
                            <div className="w-full border-4 border-white p-6 bg-black/80 text-center">
                                <p className="text-green-400 text-lg animate-pulse">
                                    {'>'} {loadingText} <span className="animate-blink">_</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <button
                        onClick={onSwitchToV1}
                        className="mt-8 text-xs text-white/50 hover:text-white underline decoration-dashed underline-offset-4"
                    >
                        [ 클래식 청첩장으로 돌아가기 ]
                    </button>
                </div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-50 opacity-10"
                style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 51%)', backgroundSize: '100% 4px' }}
            ></div>
        </div>
    );
};

export default TitleScreen;

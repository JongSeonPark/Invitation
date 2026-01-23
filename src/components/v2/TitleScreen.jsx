import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { signInAnonymously, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";
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
                    // Sign In Anonymously if not logged in
                    const result = await signInAnonymously(auth);
                    currentUser = result.user;
                }

                // 2. Update Profile with Nickname
                await updateProfile(currentUser, {
                    displayName: nickname
                });

                // 3. Ensure Firestore Document Exists
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        nickname: nickname,
                        achievements: [],
                        createdAt: new Date()
                    });
                } else {
                    // Update nickname if changed
                    await setDoc(userRef, { nickname: nickname }, { merge: true });
                }

                // Achievement: FIRST_STEP
                checkAchievement('LOGIN');

                // Proceed to Game
                onStart();

            } catch (error) {
                console.error("Login Failed", error);
                alert("입장에 실패했습니다. 다시 시도해주세요.");
                setLoading(false);
            }
        }, 3000); // Wait for sequence to finish
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 font-body relative z-10">

            {/* Glass Card Container */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-soft-xl border border-white/60 flex flex-col items-center justify-center max-w-lg w-full transition-all duration-700 ease-out transform"
                style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)' }}>

                {/* Logo Area */}
                <div className="mb-8 text-center">
                    <h1 className="text-6xl md:text-8xl font-heading text-primary drop-shadow-sm tracking-wide mb-4 animate-fade-in-up">
                        Wedding
                    </h1>
                    <p className="text-text/80 text-xl font-medium tracking-widest uppercase border-b border-primary/20 pb-2 inline-block">
                        Invitation
                    </p>
                </div>

                {/* Character/Icon Placeholder */}
                <div className="my-6 relative group cursor-pointer">
                    <div className="w-24 h-24 bg-gradient-to-br from-white to-soft-pink rounded-full shadow-soft-md flex items-center justify-center text-4xl overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-soft-lg border border-white/50">
                        🕊️
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 w-full">
                    {/* Input & Button - Always Visible */}
                    {!loading ? (
                        <>
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    placeholder="성함을 입력해주세요"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="w-full h-14 pl-4 pr-4 rounded-xl border border-secondary/30 bg-white/50 text-center text-lg text-text font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white/80 transition-all duration-300 placeholder:text-gray-400/70"
                                    maxLength={8}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleLogin}
                                className="w-full bg-cta text-white h-14 rounded-xl font-semibold text-lg shadow-soft-md hover:shadow-soft-lg hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                <span>입장하기</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </>
                    ) : (
                        /* Loading State */
                        <div className="w-full bg-white/60 px-6 py-6 rounded-xl border border-white/50 animate-pulse text-center">
                            <p className="text-primary font-medium text-lg">
                                {loadingText}
                            </p>
                        </div>
                    )}
                </div>

                {/* Switch Mode */}
                <button
                    onClick={onSwitchToV1}
                    className="mt-8 text-text/60 text-sm hover:text-primary transition-colors border-b border-transparent hover:border-primary/30 pb-0.5"
                >
                    Back to Classic Mode
                </button>
            </div>
        </div>
    );
};

export default TitleScreen;

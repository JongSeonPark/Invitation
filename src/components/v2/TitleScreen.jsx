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
        <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-yellow-300 to-orange-400 p-4 font-['Jua']">

            {/* Logo Area */}
            <div className={`transform transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[-50px] opacity-0 scale-90'}`}>
                <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)] tracking-tighter mb-2 animate-bounce select-none">
                    <span className="inline-block hover:scale-110 transition-transform cursor-pointer text-cyan-500 transform -rotate-6">W</span>
                    <span className="inline-block hover:scale-110 transition-transform cursor-pointer text-pink-500 transform rotate-3">E</span>
                    <span className="inline-block hover:scale-110 transition-transform cursor-pointer text-yellow-300 transform -rotate-3">D</span>
                    <span className="inline-block hover:scale-110 transition-transform cursor-pointer text-green-400 transform rotate-6">D</span>
                    <span className="inline-block hover:scale-110 transition-transform cursor-pointer text-purple-400 transform -rotate-2">I</span>
                    <span className="inline-block hover:scale-110 transition-transform cursor-pointer text-red-400 transform rotate-4">N</span>
                    <span className="inline-block hover:scale-110 transition-transform cursor-pointer text-blue-400 transform -rotate-3">G</span>
                </h1>
                <p className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-md bg-black/20 rounded-full px-6 py-2 mx-auto w-fit backdrop-blur-sm">
                    Is Coming!
                </p>
            </div>

            {/* Character Placeholder */}
            <div className="my-8 relative group cursor-pointer">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] flex items-center justify-center text-4xl overflow-hidden transform transition-transform group-hover:scale-110 group-active:scale-95 duration-200">
                    👰🤵
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 mb-8 w-full max-w-xs">
                {/* Input & Button - Always Visible */}
                {!loading ? (
                    <>
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="하객명(닉네임) 입력"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 rounded-xl border-4 border-black text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md placeholder:text-gray-300"
                                maxLength={8}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                autoFocus
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🏷️</span>
                        </div>

                        <button
                            onClick={handleLogin}
                            className="group relative w-full bg-[#22D3EE] border-4 border-black px-8 py-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all duration-100"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl">🚀</span>
                                <span className="block text-2xl font-black text-white">
                                    입장하기
                                </span>
                            </div>
                        </button>
                    </>
                ) : (
                    /* Loading State */
                    <div className="bg-black/20 px-6 py-4 rounded-2xl backdrop-blur-sm border-2 border-white/30 w-full animate-in zoom-in duration-300">
                        <p className="text-white font-black text-center text-lg break-keep leading-relaxed drop-shadow-md animate-pulse">
                            {loadingText}
                        </p>
                    </div>
                )}
            </div>

            {/* Switch Mode */}
            <button
                onClick={onSwitchToV1}
                className="text-white/80 font-bold underline hover:text-white transition-colors text-sm"
            >
                Back to Classic Mode
            </button>
        </div>
    );
};

export default TitleScreen;

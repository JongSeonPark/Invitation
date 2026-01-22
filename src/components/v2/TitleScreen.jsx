import { useEffect, useState } from 'react';

const TitleScreen = ({ onStart, onSwitchToV1 }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-yellow-300 to-orange-400 p-4">

            {/* Logo Area - Bouncy & Cheeky */}
            <div className={`transform transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[-50px] opacity-0 scale-90'}`}>
                <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)] tracking-tighter mb-2 animate-bounce">
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

            {/* Character Placeholder (Cheeky) */}
            <div className="my-8 relative group cursor-pointer">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] flex items-center justify-center text-4xl overflow-hidden transform transition-transform group-hover:scale-110 group-active:scale-95 duration-200">
                    👰🤵
                </div>
                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    TOUCH ME!
                </div>
            </div>

            {/* Start Button - Squishy */}
            <button
                onClick={onStart}
                className="group relative bg-white border-4 border-black px-12 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] transition-all duration-100 mb-6"
            >
                <span className="block text-2xl font-black text-black group-hover:scale-110 transition-transform">
                    GAME START
                </span>
            </button>

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

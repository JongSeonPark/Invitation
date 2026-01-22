import { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audioManager';
import { storyData } from '../../data/storyData';
import groomImg from '../../assets/card_images/groom_nobg.png';
import brideImg from '../../assets/card_images/bride_nobg.png';

const StoryMode = ({ onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const currentLine = storyData[currentIndex];

    useEffect(() => {
        if (!currentLine) return;

        setDisplayedText('');
        setIsTyping(true);

        let i = 0;
        const text = currentLine.text;
        const speed = 30; // Faster typing for modern feel

        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        audioManager.playClick();
        if (isTyping) {
            setDisplayedText(currentLine.text);
            setIsTyping(false);
        } else {
            if (currentIndex < storyData.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                audioManager.playConfirm();
                onClose();
            }
        }
    };

    return (
        <div
            className="w-full h-full relative flex flex-col justify-end overflow-hidden cursor-pointer min-h-[500px]"
            onClick={handleNext}
        >
            {/* Character Sprite Area - Pop Up Animation */}
            {/* Adjusted position to be higher up */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[80%] flex items-end transition-transform duration-300">
                <img
                    src={currentLine.image === 'groom' ? groomImg : brideImg}
                    alt="Character"
                    className="h-full object-contain filter drop-shadow-lg animate-in slide-in-from-bottom-10 fade-in duration-300"
                    key={currentIndex}
                />
            </div>

            {/* Dialogue Box - Larger & visual novel style */}
            <div className="relative z-10 m-4 mb-8">
                {/* Name Tag */}
                <div className="absolute -top-7 left-8 bg-[#EF4444] text-white font-['Jua'] px-8 py-2 rounded-t-xl rounded-br-xl border-2 border-black shadow-md transform -skew-x-6 origin-bottom-left z-20">
                    <span className="text-2xl inline-block transform skew-x-6 drop-shadow-sm">{currentLine.speaker}</span>
                </div>

                {/* Text Area */}
                <div className="bg-white/95 backdrop-blur border-4 border-black rounded-3xl p-8 shadow-xl min-h-[200px] relative">
                    <p className="font-['Gowun+Dodum'] text-xl md:text-2xl text-gray-800 leading-relaxed type-animation">
                        {displayedText}
                        <span className="animate-pulse inline-block ml-1 font-bold">|</span>
                    </p>

                    {/* Next Indicator */}
                    {!isTyping && (
                        <div className="absolute bottom-4 right-6 animate-bounce text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryMode;

import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../../utils/audioManager';
import { storyData } from '../../data/storyData';
import groomImg from '../../assets/card_images/groom_nobg.png';
import brideImg from '../../assets/card_images/bride_nobg.png';

const StoryMode = ({ onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const timerRef = useRef(null);

    const currentLine = storyData[currentIndex];

    useEffect(() => {
        if (!currentLine) return;

        setDisplayedText('');
        setIsTyping(true);

        const text = currentLine.text;
        let charIndex = 0;
        const speed = 30;

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            charIndex++;
            setDisplayedText(text.slice(0, charIndex));

            if (charIndex >= text.length) {
                clearInterval(timerRef.current);
                setIsTyping(false);
            }
        }, speed);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentIndex]);

    const handleNext = () => {
        audioManager.playClick();
        if (isTyping) {
            if (timerRef.current) clearInterval(timerRef.current); // Stop typing immediately
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
            className="w-full h-full relative flex flex-col justify-end overflow-hidden cursor-pointer min-h-[500px] bg-black/40 backdrop-blur-sm select-none"
            onClick={handleNext}
        >
            {/* Background Dim (Optional) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

            {/* Character Sprite Area */}
            {/* Character Sprite Area */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 h-[85%] flex items-end justify-center transition-transform duration-300 z-0 gap-4">
                {currentLine.image === 'both' ? (
                    <>
                        <img src={groomImg} alt="Groom" className="h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                        <img src={brideImg} alt="Bride" className="h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                    </>
                ) : (
                    <img
                        src={currentLine.image === 'groom' ? groomImg : currentLine.image === 'bride' ? brideImg : ''}
                        alt="Character"
                        className={`h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] ${!currentLine.image || currentLine.image === 'system' ? 'hidden' : ''}`}
                        key={currentIndex}
                    />
                )}
            </div>

            {/* Retro Dialogue Box */}
            <div className="relative z-10 mx-2 mb-2 md:m-6 md:mb-8 font-pixel">
                {/* Name Tag - Pixel Style */}
                <div className={`
                    absolute -top-10 left-0 border-4 border-white border-b-0 px-6 py-2
                    ${currentLine.speaker === '신랑' ? 'bg-blue-600' : currentLine.speaker === '신부' ? 'bg-pink-500' : 'bg-gray-700'}
                `}>
                    <span className="text-white text-xl tracking-wider uppercase drop-shadow-[2px_2px_0_black]">
                        {currentLine.speaker}
                    </span>
                </div>

                {/* Text Area */}
                <div className="bg-black/90 border-4 border-white p-6 shadow-[8px_8px_0_rgba(0,0,0,0.8)] min-h-[160px] relative">
                    <p className="text-xl md:text-2xl text-white leading-relaxed tracking-wide drop-shadow-md whitespace-pre-wrap">
                        {displayedText}
                        {isTyping && <span className="animate-blink inline-block ml-1 w-3 h-5 bg-yellow-400 align-middle"></span>}
                    </p>

                    {/* Next Indicator (Blinking Triangle) */}
                    {!isTyping && (
                        <div className="absolute bottom-4 right-4 animate-bounce">
                            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-red-500 drop-shadow-[0_2px_0_white]"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryMode;

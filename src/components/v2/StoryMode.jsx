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
            className="w-full h-full relative flex flex-col justify-end overflow-hidden cursor-pointer min-h-[500px] bg-sky-200/20"
            onClick={handleNext}
        >
            {/* Character Sprite Area */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 h-[60%] flex items-end transition-transform duration-300">
                <img
                    src={currentLine.image === 'groom' ? groomImg : brideImg}
                    alt="Character"
                    className="h-full object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
                    key={currentIndex}
                />
            </div>

            {/* Retro Dialogue Box */}
            <div className="relative z-10 m-4 mb-6">
                {/* Name Tag - Pixel Style */}
                <div className="absolute -top-10 left-0 bg-blue-600 border-4 border-black border-b-0 px-6 py-2">
                    <span className="text-white font-['Silkscreen'] text-xl tracking-wider uppercase drop-shadow-md">
                        {currentLine.speaker}
                    </span>
                </div>

                {/* Text Area */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)] min-h-[160px] relative">
                    <p className="font-['Silkscreen'] text-xl md:text-2xl text-black leading-relaxed tracking-wide">
                        {displayedText}
                        {isTyping && <span className="animate-blink inline-block ml-1 w-3 h-5 bg-black align-middle"></span>}
                    </p>

                    {/* Next Indicator (Blinking Triangle) */}
                    {!isTyping && (
                        <div className="absolute bottom-4 right-4 animate-bounce">
                            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-red-500"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryMode;

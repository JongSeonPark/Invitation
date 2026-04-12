import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const AchievementPopup = () => {
    const [queue, setQueue] = useState([]);
    const [active, setActive] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleUnlock = (e) => {
            const achievement = e.detail;
            setQueue(prev => [...prev, achievement]);
        };

        window.addEventListener('achievement-unlocked', handleUnlock);
        return () => window.removeEventListener('achievement-unlocked', handleUnlock);
    }, []);

    useEffect(() => {
        if (!active && queue.length > 0) {
            const next = queue[0];
            setQueue(prev => prev.slice(1));
            setActive(next);

            // Animation Sequence
            setTimeout(() => setVisible(true), 100);

            // Auto hide after 4 seconds
            setTimeout(() => {
                setVisible(false);
                setTimeout(() => setActive(null), 500); // Wait for exit animation
            }, 4000);
        }
    }, [active, queue]);

    if (!active) return null;

    return createPortal(
        <div className={`
            fixed top-8 left-1/2 -translate-x-1/2 z-[10000]
            transition-all duration-500 transform
            ${visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-90'}
        `}>
            {/* Glow / Particle Effects Container */}
            <div className="relative group">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 animate-pulse"></div>

                {/* Main Card */}
                <div className="relative bg-black/90 text-white min-w-[320px] max-w-sm rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.4)] border-2 border-yellow-500/50">

                    {/* Shiny Border Effect */}
                    <div className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none"></div>

                    {/* Content Layout */}
                    <div className="flex items-center p-4 gap-4">
                        {/* Icon Container */}
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-white/30 animate-bounce">
                                🏆
                            </div>
                            <div className="absolute -top-1 -right-1 text-yellow-200 animate-spin-slow">✨</div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <div className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-0.5 animate-pulse">
                                ACHIEVEMENT UNLOCKED!
                            </div>
                            <h4 className="text-lg font-bold text-white leading-tight font-pixel truncate">
                                {active.title}
                            </h4>
                            <p className="text-white/70 text-xs mt-1 truncate font-pixel">
                                {active.desc}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar / Timer Visual */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 animate-[width_4s_linear_forwards]" style={{ width: '100%' }}></div>

                    {/* Sparkles (CSS only for performance) */}
                    <div className="absolute top-0 right-10 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute bottom-2 left-4 w-1 h-1 bg-yellow-200 rounded-full animate-ping delay-300"></div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AchievementPopup;

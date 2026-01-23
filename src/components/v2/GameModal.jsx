import React from 'react';

const GameModal = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4 font-['Silkscreen'] select-none">
            <div className="w-full max-w-lg max-h-[85vh] bg-white border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-[slideUp_0.3s_steps(4)] relative">

                {/* Pixel Corner Decorations (CSS pseudo-elements or just simple borders) */}

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b-4 border-black bg-blue-600 text-white">
                    <div className="flex items-center gap-2">
                        <span className="animate-pulse">▶</span>
                        <span className="text-lg uppercase tracking-wider">
                            {title}
                        </span>
                    </div>
                    <button
                        className="text-white hover:text-yellow-300 transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-white hover:bg-white/10"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-0 scrollbar-hide bg-white relative">
                    {/* Inner content wrapper for spacing if needed */}
                    <div className="h-full">
                        {children}
                    </div>
                </div>

                {/* Footer aesthetics (optional) */}
                <div className="h-2 bg-black w-full"></div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default GameModal;

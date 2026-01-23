import React from 'react';

const GameModal = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 selection:bg-primary/20 selection:text-primary">
            <div className="w-full max-w-lg max-h-[80vh] bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-soft-xl flex flex-col overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-primary/10 bg-white/40">
                    <span className="text-xl font-heading font-bold text-primary tracking-wide">
                        {title}
                    </span>
                    <button
                        className="text-text/50 hover:text-cta transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-0 text-text scrollbar-hide">
                    {children}
                </div>
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

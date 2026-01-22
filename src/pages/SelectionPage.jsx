const SelectionPage = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background font-body p-4">
            <div className="card max-w-md w-full text-center space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl text-text font-heading tracking-wider">INVITATION</h1>
                    <p className="text-xl text-text/80 font-medium">박종선 & 윤지수</p>
                </div>

                <div className="w-12 h-px bg-gray-300 mx-auto"></div>

                <p className="text-text/60 tracking-widest">2026. 04. 25. SAT PM 04:50</p>

                <div className="flex flex-col gap-4">
                    <a href="classic.html" className="btn-secondary flex items-center justify-center gap-2 group">
                        <span className="group-hover:scale-110 transition-transform">✉️</span>
                        청첩장 보기 (Classic)
                    </a>
                    <a href="game.html" className="btn-primary flex items-center justify-center gap-2 group">
                        <span className="group-hover:rotate-12 transition-transform">🎮</span>
                        게임 시작 (Game Mode)
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SelectionPage;
